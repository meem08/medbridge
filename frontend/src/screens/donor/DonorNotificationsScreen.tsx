import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Card } from '../../components/Card';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useBlood } from '../../context/BloodContext';
import { API_URL } from '../../utils/api';

interface DonorNotificationItem {
  id: string;
  type: 'critical' | 'match' | 'reward';
  tag: string;
  time: string;
  title: string;
  description: string;
  isRead: boolean;
}

export const DonorNotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { requests } = useBlood();

  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'match' | 'reward'>('all');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonorAssets = async () => {
      if (!user?.id) return;
      try {
        const [apptsRes, historyRes] = await Promise.all([
          fetch(`${API_URL}/donors/appointments/${user.id}`).then((r) => r.json()),
          fetch(`${API_URL}/donors/history/${user.id}`).then((r) => r.json()),
        ]);

        if (apptsRes.success && apptsRes.data) {
          setAppointments(apptsRes.data);
        }
        if (historyRes.success && historyRes.data) {
          setDonations(historyRes.data);
        }
      } catch (err) {
        console.error('Error fetching donor notifications assets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorAssets();
  }, [user]);

  const notifications = useMemo<DonorNotificationItem[]>(() => {
    const list: DonorNotificationItem[] = [];

    // 1. Emergency Requests matching donor blood type (Critical)
    const matchingReqs = requests.filter(
      (r) =>
        r.status === 'pending' &&
        (r.bloodType === (user as any)?.bloodType || (user as any)?.bloodType === 'O-')
    );
    matchingReqs.forEach((req) => {
      list.push({
        id: `req-${req.id}`,
        type: 'critical',
        tag: 'Urgent Request',
        time: 'Active',
        title: `Emergency ${req.bloodType} Needed`,
        description: `${req.hospitalName} has issued a critical alert for ${req.bloodType} blood. As a compatible donor, your assistance is requested.`,
        isRead: readIds.includes(`req-${req.id}`),
      });
    });

    // 2. Confirmed Appointments (Match)
    appointments.forEach((appt) => {
      list.push({
        id: `appt-${appt.id}`,
        type: 'match',
        tag: 'Appointment Confirmed',
        time: 'Upcoming',
        title: 'Booking Confirmed',
        description: `Your blood donation appointment on ${appt.date} at ${appt.time} has been verified and confirmed. Venue: ${appt.venue || 'Donor Center'}.`,
        isRead: readIds.includes(`appt-${appt.id}`),
      });
    });

    // 3. Reward Badges Unlocked (Reward)
    const count = donations.length;
    if (count >= 1) {
      list.push({
        id: 'reward-first',
        type: 'reward',
        tag: 'Badge Unlocked',
        time: 'Unlocked',
        title: 'First Donation Badge',
        description: 'Congratulations! You completed your first blood donation and saved up to 3 lives. Thank you!',
        isRead: readIds.includes('reward-first'),
      });
    }
    if (count >= 5) {
      list.push({
        id: 'reward-5',
        type: 'reward',
        tag: 'Badge Unlocked',
        time: 'Unlocked',
        title: '5-Life Saver Achievement',
        description: 'Congratulations! You completed 5 donations, saving up to 15 lives. Your badge is unlocked!',
        isRead: readIds.includes('reward-5'),
      });
    }
    if (count >= 10) {
      list.push({
        id: 'reward-10',
        type: 'reward',
        tag: 'Badge Unlocked',
        time: 'Unlocked',
        title: '10-Life Hero Achievement',
        description: 'Congratulations! You completed 10 donations, saving up to 30 lives. You are a community hero!',
        isRead: readIds.includes('reward-10'),
      });
    }

    return list;
  }, [requests, user, appointments, donations, readIds]);

  const handleMarkAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    Alert.alert('Success', 'All notifications marked as read.');
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const renderItem = ({ item }: { item: DonorNotificationItem }) => {
    const isCritical = item.type === 'critical';
    return (
      <Card
        isLowStock={isCritical}
        style={[styles.notifCard, item.isRead ? styles.readCard : undefined]}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTag, isCritical ? styles.tagCritical : styles.tagNormal]}>
            {item.tag}
          </Text>
          <Text style={styles.cardTime}>{item.time}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Title block */}
      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 ? (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{unreadCount}</Text>
            </View>
          ) : null}
        </View>
        <TouchableOpacity onPress={handleMarkAllRead} style={styles.markReadBtn}>
          <Text style={styles.markReadText}>Mark all as read</Text>
          <Ionicons name="checkmark-done" size={16} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* Tabs Menu */}
      <View style={styles.tabsContainer}>
        {['all', 'critical', 'match', 'reward'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              style={[styles.tabButton, isActive ? styles.tabActive : null]}
            >
              <Text style={[styles.tabText, isActive ? styles.tabTextActive : null]}>
                {tab === 'match' ? 'BOOKINGS' : tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notifications List */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>No notifications found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.containerPadding,
    paddingTop: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleSection: {
    paddingHorizontal: spacing.containerPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.styles.headlineLg,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: colors.secondary,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 3,
  },
  countText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textLight,
    fontWeight: '700',
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  markReadText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    fontSize: 11,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.containerPadding,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  tabButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadius.sm,
    backgroundColor: '#eff4ff',
  },
  tabActive: {
    backgroundColor: colors.secondary, // Highlight in Red
  },
  tabText: {
    ...typography.styles.labelSm,
    fontSize: 10,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  tabTextActive: {
    color: colors.textLight,
  },
  listContent: {
    padding: spacing.containerPadding,
    gap: spacing.md,
  },
  notifCard: {
    marginBottom: 0,
  },
  readCard: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardTag: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tagCritical: {
    color: colors.secondary,
  },
  tagNormal: {
    color: colors.primary,
  },
  cardTime: {
    ...typography.styles.bodySm,
    fontSize: 10,
    color: colors.textMuted,
  },
  cardTitle: {
    ...typography.styles.headlineMd,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  cardDesc: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.styles.bodyMd,
    color: colors.textMuted,
  },
});
