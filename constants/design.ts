// Design tokens for Reveal - Medical-tech aesthetic with lime green
export const colors = {
  // Primary brand colors
  primary: '#84CC16', // Lime green
  primaryDark: '#65A30D', // Darker lime
  primaryLight: '#BEF264', // Light lime
  
  // Secondary greens
  secondary: '#22C55E', // Green
  secondaryDark: '#16A34A',
  
  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F8FDF4', // Very light lime tint
  backgroundTertiary: '#F0FDF4', // Light green tint
  
  // Text
  text: '#0F172A', // Dark slate
  textSecondary: '#64748B', // Medium slate
  textLight: '#94A3B8', // Light slate
  
  // Status colors
  success: '#22C55E',
  warning: '#F97316', // Orange for warnings
  error: '#EF4444',
  info: '#3B82F6',
  
  // UI elements
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  shadow: '#00000010',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  h4: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyLarge: { fontSize: 18, fontWeight: '400' as const, lineHeight: 28 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
};

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};
