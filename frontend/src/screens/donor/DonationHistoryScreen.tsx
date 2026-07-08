import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/api';

interface DonationItem {
  id: string;
  date: string;
  location: string;
  units: number;
  bp: string;          // Blood Pressure
  hemoglobin: string;  // Hemoglobin levels
  pulse: string;       // Pulse rate
}

export const DonationHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [history, setHistory] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`${API_URL}/donors/history/${user.id}`);
        const resData = await response.json();
        if (resData.success && resData.data) {
          setHistory(resData.data);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const renderDonationItem = ({ item }: { item: DonationItem }) => {
    return (
      <Card 
        style={styles.donationCard}
        onPress={() => (navigation as any).navigate('DonorHealthVerification', { donationId: item.id.toUpperCase() })}
      >
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

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      ) : (
        <FlatList
          data={history}
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
