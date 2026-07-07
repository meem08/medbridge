import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useBlood } from '../../context/BloodContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { formatDate } from '../../utils/formatters';

type DonorParamList = {
  DonorDashboard: undefined;
  BookAppointment: undefined;
  DonationHistory: undefined;
  ChooseRole: undefined;
};

type NavigationProp = StackNavigationProp<DonorParamList, 'DonorDashboard'>;

export const DonorDashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();
  const { requests } = useBlood();

  const handleLogout = () => {
    logout();
    navigation.getParent()?.navigate('ChooseRole');
  };

  // Find any active critical requests
  const criticalRequests = requests.filter(
    (req) => req.urgency === 'critical' && req.status === 'pending'
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Brand Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>DONOR PORTAL</Text>
          <Text style={styles.donorName} numberOfLines={1}>
            {user?.name || 'Tinashe Pharaoh'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Donor Impact Stats Card with red badge */}
        <Card style={styles.impactCard} navyHeaderLine={false}>
          <Text style={styles.cardLabel}>YOUR DONOR CARD</Text>
          <View style={styles.bloodTypeContainer}>
            <Text style={styles.bloodLabel}>Registered Type</Text>
            <View style={styles.bloodBadge}>
              <Text style={styles.bloodBadgeText}>O-</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statNum}>3</Text>
              <Text style={styles.statLabel}>Donations</Text>
            </View>
            <View style={[styles.statCol, styles.statColBorder]}>
              <Text style={styles.statNum}>9</Text>
              <Text style={styles.statLabel}>Lives Saved</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statNum}>Yes</Text>
              <Text style={styles.statLabel}>Eligible Now</Text>
            </View>
          </View>
        </Card>

        {/* Urgent Emergency Call to Action (Red warning style) */}
        {criticalRequests.length > 0 ? (
          <Card style={styles.alertCard} isLowStock={true}>
            <Text style={styles.alertTitle}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.secondary} /> IMMEDIATE ACTION REQUIRED
            </Text>
            <Text style={styles.alertDesc}>
              There are active emergency blood requests in your region. Your blood type (O Negative) is the universal donor type and is highly needed.
            </Text>
            <Button
              title="Respond to Request"
              onPress={() => navigation.navigate('BookAppointment')}
              variant="emergency" // Vibrant Red
              style={styles.alertBtn}
            />
          </Card>
        ) : null}

        {/* Standard CTA */}
        <View style={styles.actionContainer}>
          <Text style={styles.sectionTitle}>Donate Blood</Text>
          <Text style={styles.sectionDesc}>
            Booking an appointment takes only 5 minutes. Select a time slot at your nearest donation center.
          </Text>
          <Button
            title="Schedule Appointment"
            onPress={() => navigation.navigate('BookAppointment')}
            variant="secondary" // Red primary action button for Donors
            style={styles.actionBtn}
          />
        </View>

        {/* Navigation Options */}
        <View style={styles.optionsContainer}>
          <Card
            onPress={() => navigation.navigate('DonationHistory')}
            style={styles.optionCard}
          >
            <View style={styles.optionInner}>
              <Text style={styles.optionTitle}>Donation History</Text>
              <Text style={styles.optionDesc}>
                View dates, locations, and health summaries of your past donations.
              </Text>
            </View>
          </Card>
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
  welcomeText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  donorName: {
    ...typography.styles.headlineMd,
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: '700',
    maxWidth: 240,
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
  impactCard: {
    paddingVertical: spacing.lg,
  },
  cardLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bloodLabel: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.textPrimary,
  },
  bloodBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary, // Red Badge for O- donor
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodBadgeText: {
    ...typography.styles.labelMd,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textLight,
    fontWeight: '700',
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statColBorder: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  statNum: {
    ...typography.styles.headlineMd,
    color: colors.primary,
  },
  statLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
    fontWeight: '600',
  },
  alertCard: {
    borderColor: colors.secondary,
  },
  alertTitle: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.secondary,
    fontWeight: '700',
  },
  alertDesc: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  alertBtn: {
    marginTop: spacing.md,
  },
  actionContainer: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.styles.headlineMd,
    fontSize: 20,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  sectionDesc: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  actionBtn: {
    width: '100%',
  },
  optionsContainer: {
    marginTop: spacing.sm,
  },
  optionCard: {
    padding: spacing.md,
  },
  optionInner: {
    flexDirection: 'column',
  },
  optionTitle: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  optionDesc: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
});
