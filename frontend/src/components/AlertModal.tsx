import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

interface AlertModalProps {
  visible: boolean;
  type?: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  type = 'info',
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText,
}) => {
  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle-outline', color: '#10b981' }; // Emerald green
      case 'error':
        return { name: 'alert-circle-outline', color: colors.secondary }; // Red
      case 'warning':
        return { name: 'warning-outline', color: '#f59e0b' }; // Amber orange
      case 'info':
      default:
        return { name: 'information-circle-outline', color: colors.primary }; // Blue
    }
  };

  const icon = getIconConfig();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.card}>
          {/* Header Icon */}
          <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
            <Ionicons name={icon.name as any} size={40} color={icon.color} />
          </View>

          {/* Texts */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Action Row */}
          <View style={styles.actionRow}>
            {cancelText && (
              <Button
                title={cancelText}
                onPress={onClose}
                variant="text"
                style={styles.cancelBtn}
                textStyle={styles.cancelBtnText}
              />
            )}
            <Button
              title={confirmText}
              onPress={onConfirm || onClose}
              variant={type === 'success' || type === 'info' ? 'primary' : 'secondary'}
              style={[styles.confirmBtn, cancelText ? { flex: 1 } : null]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(9, 11, 22, 0.45)', // Premium dark overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    // Premium soft shadow
    shadowColor: '#0a0d1a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.styles.headlineLg,
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.styles.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtn: {
    minWidth: 120,
  },
  cancelBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
