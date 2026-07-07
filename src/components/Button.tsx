import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, typography } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'emergency' | 'outline' | 'text';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getStyles = () => {
    let buttonStyle: ViewStyle = styles.primary;
    let titleStyle: TextStyle = styles.primaryText;

    switch (variant) {
      case 'emergency':
        buttonStyle = styles.emergency;
        titleStyle = styles.emergencyText;
        break;
      case 'secondary':
        buttonStyle = styles.secondary;
        titleStyle = styles.secondaryText;
        break;
      case 'outline':
        buttonStyle = styles.outline;
        titleStyle = styles.outlineText;
        break;
      case 'text':
        buttonStyle = styles.textBtn;
        titleStyle = styles.textBtnText;
        break;
      case 'primary':
      default:
        buttonStyle = styles.primary;
        titleStyle = styles.primaryText;
        break;
    }

    return { buttonStyle, titleStyle };
  };

  const { buttonStyle, titleStyle } = getStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        buttonStyle,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'text' ? colors.primary : colors.textLight}
        />
      ) : (
        <Text style={[styles.baseText, titleStyle, disabled && styles.disabledText, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: spacing.touchTargetMin, // 48px touch target
    borderRadius: spacing.borderRadius.sm, // Soft rounding (4px / 0.25rem)
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
  },
  baseText: {
    ...typography.styles.labelMd,
    fontFamily: typography.fontFamilyLabel,
  },
  primary: {
    backgroundColor: colors.primary, // Deep Navy
  },
  primaryText: {
    color: colors.textLight,
  },
  emergency: {
    backgroundColor: colors.secondary, // Vibrant Red
    borderWidth: 1,
    borderColor: colors.secondaryDark,
  },
  emergencyText: {
    color: colors.textLight,
    fontWeight: '700',
  },
  secondary: {
    backgroundColor: colors.secondary, // Vibrant Red (action/alert accent)
  },
  secondaryText: {
    color: colors.textLight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  textBtn: {
    backgroundColor: 'transparent',
    height: 'auto',
    paddingHorizontal: 0,
  },
  textBtnText: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  disabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  disabledText: {
    color: colors.textMuted,
  },
});
