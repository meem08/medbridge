import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Ionicons } from '@expo/vector-icons';

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
        <Ionicons
          name="help-circle-outline"
          size={18}
          color={activeTab === 'help' ? colors.textLight : colors.textSecondary}
        />
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
        <Ionicons
          name="lock-closed-outline"
          size={16}
          color={activeTab === 'security' ? colors.textLight : colors.textSecondary}
        />
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
        <Ionicons
          name="information-circle-outline"
          size={18}
          color={activeTab === 'info' ? colors.textLight : colors.textSecondary}
        />
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
  tabLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  tabTextActive: {
    color: colors.textLight, // White text when active
  },
  tabTextInactive: {
    color: colors.textSecondary, // Gray text when inactive
  },
});
