import React from 'react';
import { View, StyleSheet, ViewStyle, Platform, StyleProp } from 'react-native';
import { colors, spacing } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  isLowStock?: boolean;
  navyHeaderLine?: boolean;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  isLowStock = false,
  navyHeaderLine = false,
  onPress,
}) => {
  const Container = onPress ? require('react-native').TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1.0}
      style={[
        styles.card,
        navyHeaderLine && styles.navyTopBorder,
        isLowStock && styles.lowStockBorder,
        style,
      ]}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1, // thin 1px border
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.sm, // 4px / 0.25rem corner radius
    padding: spacing.md,
    marginBottom: spacing.md,
    ...Platform.select({
      web: {
        boxShadow: 'none',
      },
      default: {
        shadowOpacity: 0,
        elevation: 0,
      },
    }),
  },
  lowStockBorder: {
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary, // Vibrant Red for warnings
  },
  navyTopBorder: {
    borderTopWidth: 2,
    borderTopColor: colors.primary, // Navy top-border for hierarchy
  },
});
