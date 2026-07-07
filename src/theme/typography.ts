import { Platform } from 'react-native';

export const typography = {
  // Font Families (Clinical Vitality Strategy)
  fontFamily: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  }),
  fontFamilyLabel: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'System',
  }),

  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 28,
    xxxl: 32,
    display: 40,
  },

  // Font Weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },

  // Line Heights
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
    display: 48,
  },

  // Predefined Styles matching the new wireframe parameters
  styles: {
    headlineXl: {
      fontSize: 40,
      fontWeight: '800' as const,
      lineHeight: 48,
      letterSpacing: -0.8,
    },
    headlineLg: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    headlineLgMobile: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 36,
    },
    headlineMd: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    bodyLg: {
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 28,
    },
    bodyMd: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodySm: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    labelMd: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 20,
      letterSpacing: 0.7, // 0.05em
    },
    labelSm: {
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
    },
  },
};

export type TypographyType = typeof typography;
