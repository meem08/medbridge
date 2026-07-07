import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { formatDate } from '../../utils/formatters';

interface DonationItem {
  id: string;
  date: string;
  location: string;
  units: number;
  bp: string;          // Blood Pressure
  hemoglobin: string;  // Hemoglobin levels
  pulse: string;       // Pulse rate
}

const MOCK_HISTORY: DonationItem[] = [
  {
    id: 'don_1',
    date: '2026-03-12T10:30:00Z',
    location: 'City Central Blood Bank',
    units: 1,
    bp: '118/76',
    hemoglobin: '14.8 g/dL',
    pulse: '72 bpm',
  },
  {
    id: 'don_2',
    date: '2025-11-04T09:15:00Z',
    location: 'City Central Blood Bank',
    units: 1,
    bp: '120/80',
    hemoglobin: '15.1 g/dL',
    pulse: '68 bpm',
  },
  {
    id: 'don_3',
    date: '2025-07-20T14:00:00Z',
    location: 'St. Jude Hospital Clinic',
    units: 1,
    bp: '115/78',
    hemoglobin: '14.2 g/dL',
    pulse: '75 bpm',
  },
];

export const DonationHistoryScreen: React.FC = () => {
  const navigation = useNavigation();

  const renderDonationItem = ({ item }: { item: DonationItem }) => {
    return (
      <Card style={styles.donationCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
            <Text style={styles.cardLocation}>
              <Ionicons name="location-outline" size={12} color={colors.textSecondary} /> {item.location}
            </Text>
          </View>
          <Badge type="success" label="SUCCESSFUL" />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Volume</Text>
            <Text style={styles.statValue}>{item.units} Unit</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Blood Press.</Text>
            <Text style={styles.statValue}>{item.bp}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Hemoglobin</Text>
            <Text style={styles.statValue}>{item.hemoglobin}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Pulse</Text>
            <Text style={styles.statValue}>{item.pulse}</Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Donation History</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={MOCK_HISTORY}
        renderItem={renderDonationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Card style={styles.emptyCard} navyHeaderLine={true}>
            <Text style={styles.emptyText}>No donations recorded yet.</Text>
            <Text style={styles.emptySub}>Your impact will show here once you donate.</Text>
          </Card>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    paddingVertical: spacing.xs,
    width: 60,
  },
  backText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.primary,
    fontWeight: '700',
  },
  headerTitle: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 60,
  },
  listContent: {
    padding: spacing.containerPadding,
    gap: spacing.md,
  },
  donationCard: {
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardDate: {
    ...typography.styles.headlineMd,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  cardLocation: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    fontSize: 9,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  statValue: {
    ...typography.styles.bodySm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.xs / 2,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.textSecondary,
  },
  emptySub: {
    ...typography.styles.bodySm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
