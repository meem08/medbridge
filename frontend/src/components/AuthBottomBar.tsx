import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { AlertModal } from './AlertModal';

interface AuthBottomBarProps {
  activeTab?: 'help' | 'security' | 'info';
}

export const AuthBottomBar: React.FC<AuthBottomBarProps> = ({ activeTab = 'security' }) => {
  const [modalState, setModalState] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

  const openModal = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setModalState({ visible: true, title, message, type });
  };

  return (
    <View style={styles.container}>
      {/* Help Tab */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tab, activeTab === 'help' ? styles.tabActive : null]}
        onPress={() => openModal('Help Center', 'Contact support at support@medbridge.org or call +1 (800) 555-0199 for urgent access issues.', 'info')}
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
        onPress={() => openModal('Security', 'MedBridge uses encrypted authentication and role-based access controls to protect donor, hospital, and blood bank accounts.', 'success')}
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
        onPress={() => openModal('About MedBridge', 'MedBridge connects hospitals, donors, and blood banks in real time to improve emergency blood coordination.', 'info')}
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
      <AlertModal
        visible={modalState.visible}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onClose={() => setModalState((prev) => ({ ...prev, visible: false }))}
      />
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
