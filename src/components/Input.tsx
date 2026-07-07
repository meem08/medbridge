import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  Platform,
} from 'react-native';
import { colors, spacing, typography } from '../theme';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  containerStyle,
  inputStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <TextInput
        style={[
          styles.input,
          isFocused ? styles.inputFocused : null,
          error ? styles.inputError : null,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  input: {
    height: spacing.touchTargetMin, // 48px touch target
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.sm, // 4px (ROUND_FOUR)
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    ...Platform.select({
      ios: {
        fontFamily: typography.fontFamily,
      },
      android: {
        fontFamily: typography.fontFamily,
      },
    }),
  },
  inputFocused: {
    borderColor: colors.primary, // 2px focus border Deep Navy
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.secondary, // Vibrant Red error
  },
  errorText: {
    ...typography.styles.labelSm,
    color: colors.secondary,
    marginTop: spacing.xs,
  },
});
