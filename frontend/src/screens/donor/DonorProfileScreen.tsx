import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Card } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://localhost:5001/api';

export const DonorProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`${API_URL}/auth/profile/${user.id}`);
        const resData = await response.json();
        if (resData.success && resData.data) {
          setProfile(resData.data);
        }
      } catch (err) {
        console.error('Error fetching donor profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
    const rootNav = navigation.getParent() || navigation;
    (rootNav as any).navigate('ChooseRole');
  };

  const menuOptions = [
    { name: 'Notifications History', icon: 'notifications-outline', route: 'DonorNotifications' },
    { name: 'Health Record & Vitals', icon: 'fitness-outline', route: 'DonationHistory' },
    { name: 'Eligibility Guidelines', icon: 'shield-checkmark-outline', action: () => Alert.alert('Eligibility Check', 'You are currently eligible to donate.') },
    { name: 'Personal Profile Info', icon: 'person-outline', action: () => Alert.alert('Profile Settings', 'Personal information details page.') },
    { name: 'App Settings', icon: 'settings-outline', action: () => Alert.alert('Settings', 'Notification preferences & dark mode settings.') },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </SafeAreaView>
    );
  }

  const donationsCount = profile?.donations?.length || 0;
  const livesSavedCount = donationsCount * 3;

  const badges = [
    { title: 'First Donation', sub: 'Unlocked 2021', icon: 'heart', locked: donationsCount < 1 },
    { title: '5-Life Saver', sub: 'Unlocked 2021', icon: 'water', locked: donationsCount < 5 },
    { title: '10-Life Hero', sub: 'Locked', icon: 'trophy', locked: donationsCount < 10 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={colors.secondary} />
          </View>
          <View>
            <Text style={styles.welcomeText}>Hello, {profile?.name?.split(' ')[0] || 'Donor'}</Text>
            <Text style={styles.subtext}>Saving lives since 2021</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Urgent Request Banner */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => (navigation as any).navigate('BookAppointment')}
          style={styles.urgentBanner}
        >
          <View style={styles.urgentIcon}>
            <Ionicons name="alert-circle" size={20} color={colors.textLight} />
          </View>
          <View>
            <Text style={styles.urgentTitle}>URGENT REQUEST</Text>
            <Text style={styles.urgentDesc}>Hospitals need O- Blood Units immediately.</Text>
          </View>
        </TouchableOpacity>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Donor Diagnostics</Text>
        <View style={styles.grid}>
          {/* Blood Group */}
          <View style={styles.gridCard}>
            <Text style={styles.gridCardLabel}>BLOOD GROUP</Text>
            <View style={styles.bloodTypePill}>
              <Text style={styles.bloodTypeText}>{profile?.bloodType || 'N/A'}</Text>
            </View>
            <Text style={styles.gridCardSub}>{profile?.bloodType === 'O-' ? 'Universal Donor' : 'Compatible Donor'}</Text>
          </View>

          {/* Eligibility */}
          <View style={styles.gridCard}>
            <Text style={styles.gridCardLabel}>ELIGIBILITY</Text>
            <View style={styles.eligibleBadge}>
              <Ionicons name="checkmark-circle" size={24} color={profile?.isEligible ? colors.primary : colors.textMuted} />
              <Text style={styles.eligibleText}>{profile?.isEligible ? 'YES' : 'NO'}</Text>
            </View>
            <Text style={styles.gridCardSub}>{profile?.isEligible ? 'Ready to Donate' : 'Temporary Hold'}</Text>
          </View>
        </View>

        {/* Mini stats row */}
        <View style={styles.miniStatsRow}>
          <View style={styles.miniStatCard}>
            <Ionicons name="heart" size={18} color={colors.secondary} />
            <View>
              <Text style={styles.miniStatLabel}>Lives Saved</Text>
              <Text style={styles.miniStatValue}>{livesSavedCount}</Text>
            </View>
          </View>
          <View style={styles.miniStatCard}>
            <Ionicons name="water" size={18} color={colors.secondary} />
            <View>
              <Text style={styles.miniStatLabel}>Donations</Text>
              <Text style={styles.miniStatValue}>{donationsCount}</Text>
            </View>
          </View>
        </View>

        {/* Badges Horizontal Carousel */}
        <Text style={styles.sectionTitle}>Unlocked Achievements</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgesCarousel}
        >
          {badges.map((badge, idx) => (
            <View
              key={idx}
              style={[styles.badgeCard, badge.locked ? styles.badgeLocked : null]}
            >
              <View style={[styles.badgeIconWrapper, badge.locked ? styles.badgeIconLocked : null]}>
                <Ionicons
                  name={badge.icon as any}
                  size={28}
                  color={badge.locked ? colors.textMuted : colors.secondary}
                />
              </View>
              <Text style={styles.badgeTitle}>{badge.title}</Text>
              <Text style={styles.badgeSub}>{badge.sub}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Settings Options List */}
        <Text style={styles.sectionTitle}>Preferences</Text>
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
                <Ionicons name={option.icon as any} size={18} color={colors.secondary} />
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(187, 0, 20, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  welcomeText: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  subtext: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  logoutText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.primary,
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.containerPadding,
  },
  urgentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.secondary,
    borderRadius: spacing.borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  urgentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  urgentTitle: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textLight,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
  },
  urgentDesc: {
    ...typography.styles.bodySm,
    color: colors.textLight,
    marginTop: 2,
    fontWeight: '600',
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
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  gridCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.sm,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 140,
  },
  gridCardLabel: {
    ...typography.styles.labelSm,
    fontSize: 9,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  bloodTypePill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  bloodTypeText: {
    ...typography.styles.headlineMd,
    color: colors.textLight,
    fontWeight: '700',
    fontSize: 18,
  },
  eligibleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: spacing.xs,
  },
  eligibleText: {
    ...typography.styles.headlineMd,
    color: colors.primary,
    fontWeight: '800',
    fontSize: 20,
  },
  gridCardSub: {
    ...typography.styles.bodySm,
    fontSize: 9,
    color: colors.textMuted,
  },
  miniStatsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  miniStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.sm,
    padding: spacing.md,
  },
  miniStatLabel: {
    ...typography.styles.bodySm,
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  miniStatValue: {
    ...typography.styles.headlineMd,
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  badgesCarousel: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
  },
  badgeCard: {
    width: 140,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.sm,
    padding: spacing.md,
    alignItems: 'center',
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(187, 0, 20, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badgeIconLocked: {
    borderColor: colors.border,
  },
  badgeTitle: {
    ...typography.styles.labelSm,
    fontSize: 11,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  badgeSub: {
    ...typography.styles.bodySm,
    fontSize: 9,
    color: colors.secondary,
    marginTop: 2,
    fontWeight: '600',
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
