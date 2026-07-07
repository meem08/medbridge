import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Card } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';
import { useBlood } from '../../context/BloodContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BloodInventoryItem } from '../../models/inventory';

export const HospitalProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { requests, inventory } = useBlood();
  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
    navigation.getParent()?.navigate('ChooseRole');
  };

  const menuOptions = [
    { name: 'Emergency Alerts', icon: 'notifications-outline', route: 'HospitalNotifications' },
    { name: 'Nearby Hospitals', icon: 'business-outline', action: () => Alert.alert('Nearby Hospitals', 'Scanning local clinical partners...') },
    { name: 'Eligibility Guide', icon: 'document-text-outline', action: () => Alert.alert('Clinical Eligibility', 'Loading national blood eligibility standards...') },
    { name: 'Support Helpdesk', icon: 'help-circle-outline', action: () => Alert.alert('Support', 'Contacting clinical coordination IT helpdesk...') },
    { name: 'Clinical Settings', icon: 'settings-outline', action: () => Alert.alert('Settings', 'Facility settings locked by administrator.') },
  ];

  // Dynamic stats calculations
  const emergencyRequestsCount = requests.filter(r => (r.urgency === 'urgent' || r.urgency === 'critical') && r.status !== 'delivered' && r.status !== 'cancelled').length;
  const emergencyRequestsString = String(emergencyRequestsCount).padStart(2, '0');

  const inventoryItems = Object.values(inventory) as BloodInventoryItem[];
  const availableCount = inventoryItems.filter(item => item.units >= item.minRequired).length;
  const availabilityPercentage = inventoryItems.length > 0 ? Math.round((availableCount / inventoryItems.length) * 100) : 0;

  const matchingCount = requests.filter(r => r.status === 'matching').length;
  const matchingString = String(matchingCount).padStart(2, '0');

  const transitCount = requests.filter(r => r.status === 'in-transit' || r.status === 'matched').length;
  const transitString = String(transitCount).padStart(2, '0');

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="medical" size={32} color={colors.secondary} />
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome, {user?.name || 'Dr. Li'}</Text>
            <Text style={styles.hospitalText}>{(user as any)?.location?.toUpperCase() || 'CENTRAL GENERAL HOSPITAL'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stat Bento Grid */}
        <Text style={styles.sectionTitle}>Facility Overview</Text>
        <View style={styles.grid}>
          {/* Row 1, Col 1: Emergency Requests */}
          <View style={styles.gridCard}>
            <View style={styles.gridCardHeader}>
              <Text style={styles.gridCardLabel}>EMERGENCY REQUESTS</Text>
              <Ionicons name="alarm-outline" size={18} color={colors.secondary} />
            </View>
            <View style={styles.gridCardFooter}>
              <Text style={styles.gridCardValue}>{emergencyRequestsString}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: emergencyRequestsCount > 0 ? `${Math.min(100, emergencyRequestsCount * 25)}%` : '0%' }]} />
              </View>
            </View>
          </View>

          {/* Row 1, Col 2: Inventory Availability */}
          <View style={styles.gridCard}>
            <View style={styles.gridCardHeader}>
              <Text style={styles.gridCardLabel}>INVENTORY AVAILABILITY</Text>
              <Ionicons name="checkbox-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.gridCardFooter}>
              <Text style={styles.gridCardValue}>{availabilityPercentage}%</Text>
              <Text style={styles.gridCardTrend}>{availabilityPercentage >= 80 ? 'Optimal reserves safety' : 'Safety buffer critically low'}</Text>
            </View>
          </View>

          {/* Row 2, Col 1: Being Matched */}
          <View style={styles.gridCard}>
            <View style={styles.gridCardHeader}>
              <Text style={styles.gridCardLabel}>BEING MATCHED</Text>
              <Ionicons name="git-network-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.gridCardFooter}>
              <Text style={styles.gridCardValue}>{matchingString}</Text>
              <Text style={styles.gridCardSub}>AI Active</Text>
            </View>
          </View>

          {/* Row 2, Col 2: Active Deliveries */}
          <View style={styles.gridCard}>
            <View style={styles.gridCardHeader}>
              <Text style={styles.gridCardLabel}>ACTIVE DELIVERIES</Text>
              <Ionicons name="bicycle-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.gridCardFooter}>
              <Text style={styles.gridCardValue}>{transitString}</Text>
              <Text style={styles.gridCardSub}>{transitCount > 0 ? 'Courier En Route' : 'No active dispatches'}</Text>
            </View>
          </View>
        </View>

        {/* Clinical Settings Options List */}
        <Text style={styles.sectionTitle}>System Settings</Text>
        <View style={styles.optionsList}>
          {menuOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => {
                if (option.route) {
                  (navigation as any).navigate(option.route);
                } else if (option.action) {
                  option.action();
                }
              }}
              style={[styles.menuOption, index === menuOptions.length - 1 ? styles.lastOption : null]}
            >
              <View style={styles.menuOptionLeft}>
                <Ionicons name={option.icon as any} size={18} color={colors.primary} />
                <Text style={styles.menuOptionText}>{option.name}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(187, 0, 20, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  welcomeText: {
    ...typography.styles.headlineMd,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  hospitalText: {
    ...typography.styles.labelSm,
    fontSize: 9,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  logoutBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  logoutText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.secondary,
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.containerPadding,
  },
  sectionTitle: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.primary,
    fontWeight: '800',
    fontSize: 11,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  gridCard: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.sm,
    padding: spacing.md,
    justifyContent: 'space-between',
    minHeight: 120,
  },
  gridCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 4,
  },
  gridCardLabel: {
    ...typography.styles.labelSm,
    fontSize: 9,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    fontWeight: '700',
    flex: 1,
  },
  gridCardFooter: {
    marginTop: spacing.sm,
  },
  gridCardValue: {
    ...typography.styles.headlineLg,
    fontSize: 28,
    color: colors.textPrimary,
    fontWeight: '800',
    lineHeight: 32,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 2,
  },
  gridCardTrend: {
    ...typography.styles.labelSm,
    fontSize: 9,
    fontFamily: typography.fontFamilyLabel,
    color: colors.status.success,
    fontWeight: '700',
    marginTop: 4,
  },
  gridCardSub: {
    ...typography.styles.bodySm,
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 4,
  },
  optionsList: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.sm,
    overflow: 'hidden',
  },
  menuOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  menuOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuOptionText: {
    ...typography.styles.bodyMd,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
