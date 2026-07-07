import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { HospitalDashboard } from './HospitalDashboard';
import { BloodInventoryScreen } from './BloodInventoryScreen';
import { Ionicons } from '@expo/vector-icons';

export const HospitalMainContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 0:
        return <HospitalDashboard />;
      case 1:
        return <BloodInventoryScreen />;
      default:
        return <HospitalDashboard />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Screen Content Wrapper */}
      <View style={styles.content}>{renderActiveScreen()}</View>

      {/* Premium Custom Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/* Home / Dashboard Tab */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab(0)}
          style={[styles.navTab, activeTab === 0 ? styles.navTabActiveHospital : null]}
        >
          <Ionicons
            name={activeTab === 0 ? 'home' : 'home-outline'}
            size={18}
            color={activeTab === 0 ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.navLabel, activeTab === 0 ? styles.navTextActiveHospital : null]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Inventory Reserves Tab */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab(1)}
          style={[styles.navTab, activeTab === 1 ? styles.navTabActiveHospital : null]}
        >
          <Ionicons
            name={activeTab === 1 ? 'stats-chart' : 'stats-chart-outline'}
            size={18}
            color={activeTab === 1 ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.navLabel, activeTab === 1 ? styles.navTextActiveHospital : null]}>
            Reserves
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    height: 64,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: spacing.xs,
  },
  navTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadius.full,
  },
  navTabActiveHospital: {
    backgroundColor: 'rgba(0, 22, 59, 0.08)', // Light Navy background pill
  },
  navLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  navTextActiveHospital: {
    color: colors.primary, // Highlight active in Deep Navy
  },
});
