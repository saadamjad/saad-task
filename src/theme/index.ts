export const colors = {
  background: '#0B1220',
  surface: '#111827',
  card: '#1F2937',
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  accent: '#22C55E',
  error: '#64748B',
  border: '#374151',
  skeleton: '#2B3647',
  pinkLace: '#E2DDFE',
  darkShadeRed: '#D35355',
  /** Saved / remove-offline control label (high contrast on light pink button). */
  removeOfflineText: '#D35355',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

/** Single source of truth for ThemeProvider and navigation chrome. */
export const appTheme = {
  colors,
  spacing,
};

export type AppTheme = typeof appTheme;
