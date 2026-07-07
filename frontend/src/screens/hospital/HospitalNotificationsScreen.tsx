import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Card } from '../../components/Card';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useBlood } from '../../context/BloodContext';

interface NotificationItem {
  id: string;
  type: 'critical' | 'emergency' | 'nearby';
  tag: string;
  time: string;
  title: string;
  description: string;
  isRead: boolean;
}

export const HospitalNotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { requests, inventory } = useBlood();
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'emergency' | 'nearby'>('all');
  const [readIds, setReadIds] = useState<string[]>([]);

  const notifications = useMemo<NotificationItem[]>(() => {
    const list: NotificationItem[] = [];

    // 1. Low stock alerts (Critical)
    Object.values(inventory).forEach((item) => {
      if (item.units < item.minRequired) {
        list.push({
          id: `low-stock-${item.bloodType}`,
          type: 'critical',
          tag: 'Immediate Action',
          time: 'Active',
          title: `Low ${item.bloodType} Stock Level`,
          description: `Blood bank inventory for ${item.bloodType} has dropped below safety threshold (${item.units} units remaining). Immediate replenishment request required.`,
          isRead: readIds.includes(`low-stock-${item.bloodType}`),
        });
      }
    });

    // 2. Courier active dispatches (Emergency)
    requests.forEach((req) => {
      if (req.status === 'in-transit') {
        list.push({
          id: `courier-${req.id}`,
          type: 'emergency',
          tag: 'Match Dispatched',
          time: 'En Route',
          title: `Courier Departed for ${req.hospitalName}`,
          description: `Courier has departed carrying ${req.units} units of ${req.bloodType}. ETA: ${req.eta || '15 mins'}. Delivery Location: ${req.deliveryLocation || 'Emergency Ward'}.`,
          isRead: readIds.includes(`courier-${req.id}`),
        });
      }
    });

    // 3. Match found / Donors Responded (Nearby)
    requests.forEach((req) => {
      if (req.status === 'matched') {
        list.push({
          id: `match-${req.id}`,
          type: 'nearby',
          tag: 'Match Identified',
          time: 'Active',
          title: `Donor Matched for ${req.bloodType}`,
          description: `An eligible donor (${req.matchedDonorName || 'AI Pair'}) has been matched to your emergency request for ${req.units} units of ${req.bloodType}.`,
          isRead: readIds.includes(`match-${req.id}`),
        });
      }
    });

    return list;
  }, [requests, inventory, readIds]);

  const handleMarkAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    Alert.alert('Success', 'All alerts marked as read.');
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const renderItem = ({ item }: { item: NotificationItem }) => {
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
        {['all', 'critical', 'emergency', 'nearby'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              style={[styles.tabButton, isActive ? styles.tabActive : null]}
            >
              <Text style={[styles.tabText, isActive ? styles.tabTextActive : null]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notifications List */}
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
