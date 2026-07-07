import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'match' | 'reward'>('all');

  const [notifications, setNotifications] = useState<DonorNotificationItem[]>([
    {
      id: '1',
      type: 'critical',
      tag: 'Urgent Request',
      time: '5 mins ago',
      title: 'Emergency O- Needed',
      description: 'City General Hospital has issued a critical alert for O-Negative blood. As a registered universal donor, your response is highly requested.',
      isRead: false,
    },
    {
      id: '2',
      type: 'match',
      tag: 'Appointment Confirmed',
      time: '2 hours ago',
      title: 'Booking Confirmed',
      description: 'Your blood donation appointment on March 14, 2026, at 09:30 AM at Central Clinic has been verified and confirmed.',
      isRead: false,
    },
    {
      id: '3',
      type: 'reward',
      tag: 'Badge Unlocked',
      time: '1 day ago',
      title: '5-Life Saver Achievement',
      description: 'Congratulations! You have completed your 4th donation, saving up to 12 lives. Your "5-Life Saver" badge is now unlocked.',
      isRead: true,
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
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
