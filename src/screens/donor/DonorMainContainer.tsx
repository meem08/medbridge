import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { DonorDashboard } from './DonorDashboard';
import { BookAppointmentScreen } from './BookAppointmentScreen';
import { DonationHistoryScreen } from './DonationHistoryScreen';

export const DonorMainContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 0:
        return <DonorDashboard />;
      case 1:
        return <BookAppointmentScreen />;
      case 2:
        return <DonationHistoryScreen />;
      default:
        return <DonorDashboard />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Screen Content Wrapper */}
      <View style={styles.content}>{renderActiveScreen()}</View>

      {/* Premium Custom Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/* Profile / Dashboard Tab */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab(0)}
          style={[styles.navTab, activeTab === 0 ? styles.navTabActiveDonor : null]}
        >
          <Text style={[styles.navIcon, activeTab === 0 ? styles.navTextActiveDonor : null]}>
            👤
          </Text>
          <Text style={[styles.navLabel, activeTab === 0 ? styles.navTextActiveDonor : null]}>
            Profile
          </Text>
        </TouchableOpacity>

        {/* Schedule Appointment Tab */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab(1)}
          style={[styles.navTab, activeTab === 1 ? styles.navTabActiveDonor : null]}
        >
          <Text style={[styles.navIcon, activeTab === 1 ? styles.navTextActiveDonor : null]}>
            📅
          </Text>
          <Text style={[styles.navLabel, activeTab === 1 ? styles.navTextActiveDonor : null]}>
            Book
          </Text>
        </TouchableOpacity>

        {/* Donation History Tab */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab(2)}
          style={[styles.navTab, activeTab === 2 ? styles.navTabActiveDonor : null]}
        >
          <Text style={[styles.navIcon, activeTab === 2 ? styles.navTextActiveDonor : null]}>
            📜
          </Text>
          <Text style={[styles.navLabel, activeTab === 2 ? styles.navTextActiveDonor : null]}>
            History
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
  navTabActiveDonor: {
    backgroundColor: 'rgba(187, 0, 20, 0.08)', // Light Red background pill
  },
  navIcon: {
    fontSize: 18,
  },
  navLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  navTextActiveDonor: {
    color: colors.secondary, // Highlight active in Vibrant Red
  },
});
