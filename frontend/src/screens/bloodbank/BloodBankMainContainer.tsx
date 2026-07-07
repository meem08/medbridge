import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { BloodBankDashboard } from './BloodBankDashboard';
import { BloodInventoryScreen } from '../hospital/BloodInventoryScreen';
import { DonationHistoryScreen } from '../donor/DonationHistoryScreen';
import { HospitalProfileScreen } from '../hospital/HospitalProfileScreen';
import { Ionicons } from '@expo/vector-icons';

export const BloodBankMainContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 0:
        return <BloodBankDashboard />;
      case 1:
        return <BloodInventoryScreen />; // Central inventory reserves
      case 2:
        return <DonationHistoryScreen />; // Central log histories
      case 3:
        return <HospitalProfileScreen />; // Central coordination profile bento
      default:
        return <BloodBankDashboard />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Screen Content Wrapper */}
      <View style={styles.content}>{renderActiveScreen()}</View>

      {/* Premium Custom Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/* Home Tab */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab(0)}
          style={[styles.navTab, activeTab === 0 ? styles.navTabActive : null]}
        >
          <Ionicons
            name={activeTab === 0 ? 'home' : 'home-outline'}
            size={18}
            color={activeTab === 0 ? colors.secondary : colors.textSecondary}
          />
          <Text style={[styles.navLabel, activeTab === 0 ? styles.navTextActive : null]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Requests / Inventory Tab */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab(1)}
          style={[styles.navTab, activeTab === 1 ? styles.navTabActive : null]}
        >
          <Ionicons
            name={activeTab === 1 ? 'water' : 'water-outline'}
            size={18}
            color={activeTab === 1 ? colors.secondary : colors.textSecondary}
          />
          <Text style={[styles.navLabel, activeTab === 1 ? styles.navTextActive : null]}>
            Requests
          </Text>
        </TouchableOpacity>

        {/* History Logs Tab */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab(2)}
          style={[styles.navTab, activeTab === 2 ? styles.navTabActive : null]}
        >
          <Ionicons
            name={activeTab === 2 ? 'time' : 'time-outline'}
            size={18}
            color={activeTab === 2 ? colors.secondary : colors.textSecondary}
          />
          <Text style={[styles.navLabel, activeTab === 2 ? styles.navTextActive : null]}>
            History
          </Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab(3)}
          style={[styles.navTab, activeTab === 3 ? styles.navTabActive : null]}
        >
          <Ionicons
            name={activeTab === 3 ? 'person' : 'person-outline'}
            size={18}
            color={activeTab === 3 ? colors.secondary : colors.textSecondary}
          />
          <Text style={[styles.navLabel, activeTab === 3 ? styles.navTextActive : null]}>
            Profile
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
  navTabActive: {
    backgroundColor: 'rgba(187, 0, 20, 0.08)', // Light Red background pill
  },
  navLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  navTextActive: {
    color: colors.secondary, // Highlight active in Vibrant Red
  },
});
