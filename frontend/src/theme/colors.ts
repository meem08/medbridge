export const colors = {
  // Brand Colors (Clinical Vitality System)
  primary: '#00163b',          // Deep Navy (stability, trust, primary branding)
  primaryDark: '#0d2b5b',      // Navy Container Accent
  secondary: '#bb0014',        // Vibrant Red (life-saving actions, critical buttons)
  secondaryDark: '#a20513',    // Darker Red
  tertiary: '#15191a',         // Dark Slate/Neutral

  // Neutral Colors
  background: '#f8f9ff',       // Clean, pale blue/white background
  surface: '#ffffff',          // Card/Container surface
  surfaceDim: '#cbdbf5',       // Cool grey/blue surface dim
  border: '#e5eeff',           // Low-contrast outline border
  outline: '#747780',          // Slate grey outline

  // Text Colors
  textPrimary: '#0b1c30',      // Deep Navy text (high contrast)
  textSecondary: '#44474f',    // Secondary body text / labels
  textLight: '#ffffff',        // White text on navy/red blocks
  textMuted: '#747780',        // Disabled status or helper notes

  // Status Colors (Cohesive medical saturation matching Navy)
  status: {
    critical: '#bb0014',       // Critical/Alert Red
    urgent: '#ff9800',         // Warning/Orange
    normal: '#00163b',         // Safe/Navy
    success: '#4caf50',        // Complete/Delivered (Green)
  },

  // Interactive
  overlay: 'rgba(11, 28, 48, 0.4)',
  ripple: 'rgba(0, 22, 59, 0.08)',
};

export type ColorsType = typeof colors;
