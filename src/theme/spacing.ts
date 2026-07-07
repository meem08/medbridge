export const spacing = {
  // Spacing Units
  unit: 8,
  gutter: 16,
  containerPadding: 24,
  touchTargetMin: 48,

  // Stack/Margin spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Border Radius (Stitch Soft/ROUND_FOUR theme)
  borderRadius: {
    xs: 2,
    sm: 4,     // Base standard roundness (ROUND_FOUR / 4px)
    md: 8,     // Dashboard modules
    lg: 16,
    full: 9999, // Pills and badges
  },
};

export type SpacingType = typeof spacing;
