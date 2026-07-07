import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface AuthBottomBarProps {
  activeTab?: 'help' | 'security' | 'info';
}

export const AuthBottomBar: React.FC<AuthBottomBarProps> = ({ activeTab = 'security' }) => {
  return (
    <View style={styles.container}>
      {/* Help Tab */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tab, activeTab === 'help' ? styles.tabActive : null]}
        onPress={() => {}}
      >
        <Text style={[styles.tabIcon, activeTab === 'help' ? styles.tabTextActive : styles.tabTextInactive]}>
          ❓
        </Text>
        <Text style={[styles.tabLabel, activeTab === 'help' ? styles.tabTextActive : styles.tabTextInactive]}>
          Help
        </Text>
      </TouchableOpacity>

      {/* Security Tab */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tab, activeTab === 'security' ? styles.tabActive : null]}
        onPress={() => {}}
      >
        <Text style={[styles.tabIcon, activeTab === 'security' ? styles.tabTextActive : styles.tabTextInactive]}>
          🔒
        </Text>
        <Text style={[styles.tabLabel, activeTab === 'security' ? styles.tabTextActive : styles.tabTextInactive]}>
          Security
        </Text>
      </TouchableOpacity>

      {/* Info Tab */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tab, activeTab === 'info' ? styles.tabActive : null]}
        onPress={() => {}}
      >
        <Text style={[styles.tabIcon, activeTab === 'info' ? styles.tabTextActive : styles.tabTextInactive]}>
          ℹ️
        </Text>
        <Text style={[styles.tabLabel, activeTab === 'info' ? styles.tabTextActive : styles.tabTextInactive]}>
          Info
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: colors.secondary, // Highlight in Vibrant Red matching wireframe
  },
  tabIcon: {
    fontSize: 14,
  },
  tabLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  tabTextActive: {
    color: colors.textLight, // White text/icon when active
  },
  tabTextInactive: {
    color: colors.textSecondary, // Gray text/icon when inactive
  },
});
