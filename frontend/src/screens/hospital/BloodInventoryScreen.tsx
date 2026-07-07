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
import { useBlood } from '../../context/BloodContext';
import { useNavigation } from '@react-navigation/native';
import { formatDate } from '../../utils/formatters';
import { BloodInventoryItem } from '../../models/inventory';

export const BloodInventoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { inventory } = useBlood();

  const inventoryItems = Object.values(inventory) as BloodInventoryItem[];
  const totalUnits = inventoryItems.reduce((acc, curr) => acc + curr.units, 0);

  // Group inventory items into rows of 2
  const rows: BloodInventoryItem[][] = [];
  for (let i = 0; i < inventoryItems.length; i += 2) {
    rows.push(inventoryItems.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reserve Bank</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Inventory Summary Banner (Navy theme) */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>TOTAL ACTIVE RESERVES</Text>
          <Text style={styles.summaryValue}>{totalUnits} Units</Text>
          <Text style={styles.summaryMeta}>
            Last updated: {formatDate(new Date().toISOString())}
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>Stock Levels by Type</Text>

        <View style={styles.grid}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((item) => {
                const isLow = item.units < item.minRequired;
                return (
                  <Card
                    key={item.bloodType}
                    isLowStock={isLow}
                    style={styles.gridCard}
                  >
                    <View style={styles.cardInner}>
                      <Text style={[styles.bloodType, isLow ? styles.lowText : styles.normalText]}>
                        {item.bloodType}
                      </Text>
                      <View style={styles.unitContainer}>
                        <Text style={styles.unitValue}>{item.units}</Text>
                        <Text style={styles.unitLabel}>UNITS</Text>
                      </View>
                      <View style={styles.thresholdContainer}>
                        <Text style={styles.thresholdLabel}>
                          Min Required: {item.minRequired}
                        </Text>
                        {isLow ? (
                          <Text style={styles.lowLabel}>CRITICALLY LOW</Text>
                        ) : (
                          <Text style={styles.secureLabel}>SECURE</Text>
                        )}
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
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
  scrollContent: {
    padding: spacing.containerPadding,
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.primary, // Navy Banner background
    borderColor: colors.primary,
  },
  summaryLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.border,
    fontWeight: '600',
  },
  summaryValue: {
    ...typography.styles.headlineXl,
    color: colors.textLight,
    fontSize: 36,
    marginTop: spacing.xs,
  },
  summaryMeta: {
    ...typography.styles.bodySm,
    color: colors.surfaceDim,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.styles.headlineMd,
    fontSize: 20,
    color: colors.primary,
    fontWeight: '700',
    marginVertical: spacing.md,
  },
  grid: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  gridCard: {
    flex: 1,
    marginBottom: 0,
  },
  cardInner: {
    alignItems: 'center',
  },
  bloodType: {
    ...typography.styles.headlineMd,
    fontSize: 22,
    fontWeight: '700',
  },
  normalText: {
    color: colors.primary, // Deep Navy
  },
  lowText: {
    color: colors.secondary, // Vibrant Red
  },
  unitContainer: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  unitValue: {
    ...typography.styles.headlineXl,
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  unitLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: -spacing.xs / 2,
    fontWeight: '600',
  },
  thresholdContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    width: '100%',
    paddingTop: spacing.sm,
    alignItems: 'center',
  },
  thresholdLabel: {
    ...typography.styles.bodySm,
    fontSize: 10,
    color: colors.textSecondary,
  },
  lowLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    fontSize: 9,
    color: colors.secondary, // Red label
    fontWeight: '700',
    marginTop: spacing.xs / 2,
  },
  secureLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    fontSize: 9,
    color: colors.status.success, // Green label
    fontWeight: '700',
    marginTop: spacing.xs / 2,
  },
});
