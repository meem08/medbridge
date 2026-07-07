import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { UrgencyLevel, RequestStatus } from '../models/bloodRequest';

interface BadgeProps {
  type?: UrgencyLevel | RequestStatus | 'success';
  label?: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ type = 'normal', label, style }) => {
  const getBadgeStyle = () => {
    let backgroundColor = colors.primary; // Deep Navy default
    let textColor = colors.textLight;
    let text = label || String(type).toUpperCase();

    switch (type) {
      case 'critical':
        backgroundColor = 'rgba(187, 0, 20, 0.1)'; // Light Red background
        textColor = colors.secondary; // Dark Red text
        text = label || 'CRITICAL';
        break;
      case 'urgent':
        backgroundColor = 'rgba(255, 152, 0, 0.1)'; // Light Orange background
        textColor = colors.status.urgent; // Orange text
        text = label || 'URGENT';
        break;
      case 'normal':
        backgroundColor = 'rgba(0, 22, 59, 0.1)'; // Light Navy background
        textColor = colors.primary; // Navy text
        text = label || 'NORMAL';
        break;
      case 'pending':
        backgroundColor = 'rgba(255, 152, 0, 0.1)';
        textColor = colors.status.urgent;
        text = label || 'PENDING MATCH';
        break;
      case 'matching':
        backgroundColor = 'rgba(0, 22, 59, 0.1)';
        textColor = colors.primary;
        text = label || 'MATCHING';
        break;
      case 'matched':
        backgroundColor = 'rgba(0, 22, 59, 0.2)';
        textColor = colors.primary;
        text = label || 'MATCHED';
        break;
      case 'in-transit':
        backgroundColor = 'rgba(13, 43, 91, 0.1)';
        textColor = colors.primaryDark;
        text = label || 'IN TRANSIT';
        break;
      case 'delivered':
      case 'success':
        backgroundColor = 'rgba(76, 175, 80, 0.1)';
        textColor = colors.status.success;
        text = label || 'DELIVERED';
        break;
      case 'cancelled':
        backgroundColor = 'rgba(116, 119, 128, 0.1)';
        textColor = colors.textMuted;
        text = label || 'CANCELLED';
        break;
    }

    return { backgroundColor, textColor, text };
  };

  const { backgroundColor, textColor, text } = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: spacing.borderRadius.full,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    fontSize: 10,
    fontWeight: '700',
  },
});
