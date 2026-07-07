import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../../utils/formatters';

type RootStackParamList = {
  DonorHealthVerification: { donationId: string };
};

type VerificationRouteProp = RouteProp<RootStackParamList, 'DonorHealthVerification'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'DonorHealthVerification'>;

import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:5001/api';

export const DonorHealthVerificationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VerificationRouteProp>();
  const { donationId } = route.params;
  const { user } = useAuth();

  const [donation, setDonation] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDonationDetails = async () => {
      if (!user?.id || !donationId) return;
      try {
        const response = await fetch(`${API_URL}/donors/history/${user.id}`);
        const resData = await response.json();
        if (resData.success && resData.data) {
          const match = resData.data.find((d: any) => d.id.toLowerCase() === donationId.toLowerCase());
          setDonation(match);
        }
      } catch (err) {
        console.error('Error fetching donation details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationDetails();
  }, [user, donationId]);

  const handleDownloadCertificate = () => {
    Alert.alert('Download Complete', 'Your verified donation certificate has been saved to your files.');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </SafeAreaView>
    );
  }

  if (!donation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verification</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
          <Text style={styles.sectionTitle}>Record Not Found</Text>
          <Text style={styles.donorMeta}>We couldn't retrieve the health record for this donation.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        <TouchableOpacity
          onPress={() => Alert.alert('Emergency Assistance', 'Connecting to clinical dispatcher...')}
          style={styles.helpButton}
        >
          <Ionicons name="medkit" size={24} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Donor Profile Summary Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={32} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.donorName}>{user?.name || 'Donor'}</Text>
              <Text style={styles.donorId}>DON - {donation.id.replace('DON-', '')}</Text>
              <Text style={styles.donorMeta}>{(user as any)?.bloodType || 'Universal'} Donor • Verified Profile</Text>
            </View>
          </View>
        </Card>

        {/* Donation Specifics Card */}
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Donation Details</Text>
          <View style={styles.specsList}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Donation ID</Text>
              <Text style={styles.specValue}>{donation.id}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Date</Text>
              <Text style={styles.specValue}>{formatDate(donation.date)}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Venue</Text>
              <Text style={styles.specValue}>{donation.location}</Text>
            </View>
            <View style={[styles.specRow, styles.lastRow]}>
              <Text style={styles.specLabel}>Status</Text>
              <Badge type="success" label="VERIFIED" />
            </View>
          </View>
        </Card>

        {/* Clinical Health Vitals Check */}
        <Card style={styles.vitalsCard}>
          <Text style={styles.sectionTitle}>Clinical Vitals check</Text>
          
          <View style={styles.vitalItem}>
            <View>
              <Text style={styles.vitalName}>Hemoglobin Level</Text>
              <Text style={styles.vitalValue}>{donation.hemoglobin}</Text>
            </View>
            <View style={styles.passBadge}>
              <Text style={styles.passBadgeText}>PASS</Text>
            </View>
          </View>

          <View style={styles.vitalItem}>
            <View>
              <Text style={styles.vitalName}>Blood Pressure</Text>
              <Text style={styles.vitalValue}>{donation.bp} mmHg</Text>
            </View>
            <View style={styles.passBadge}>
              <Text style={styles.passBadgeText}>PASS</Text>
            </View>
          </View>

          <View style={styles.vitalItem}>
            <View>
              <Text style={styles.vitalName}>Pulse Rate</Text>
              <Text style={styles.vitalValue}>{donation.pulse}</Text>
            </View>
            <View style={styles.passBadge}>
              <Text style={styles.passBadgeText}>PASS</Text>
            </View>
          </View>

          <View style={[styles.vitalItem, styles.lastRow]}>
            <View>
              <Text style={styles.vitalName}>Donation Volume</Text>
              <Text style={styles.vitalValue}>{donation.units} Unit</Text>
            </View>
            <View style={styles.passBadge}>
              <Text style={styles.passBadgeText}>PASS</Text>
            </View>
          </View>
        </Card>

        {/* Download Certificate CTA */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleDownloadCertificate}
          style={styles.certificateLink}
        >
          <View style={styles.certInner}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            <Text style={styles.certText}>Certificate Available</Text>
          </View>
          <Ionicons name="open-outline" size={16} color={colors.primary} />
        </TouchableOpacity>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  helpButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollContent: {
    padding: spacing.containerPadding,
    gap: spacing.md,
  },
  profileCard: {
    marginBottom: 0,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 22, 59, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  donorName: {
    ...typography.styles.headlineMd,
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  donorId: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  donorMeta: {
    ...typography.styles.bodySm,
    color: colors.textMuted,
    marginTop: 4,
  },
  detailsCard: {
    marginBottom: 0,
  },
  sectionTitle: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  specsList: {
    gap: spacing.sm,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  specLabel: {
    ...typography.styles.bodyMd,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  specValue: {
    ...typography.styles.bodyMd,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  vitalsCard: {
    marginBottom: 0,
  },
  vitalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  vitalName: {
    ...typography.styles.bodyMd,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  vitalValue: {
    ...typography.styles.headlineMd,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  passBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  passBadgeText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.primary,
    fontWeight: '700',
  },
  certificateLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.sm,
    padding: spacing.md,
  },
  certInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  certText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.primary,
    fontWeight: '700',
  },
});
