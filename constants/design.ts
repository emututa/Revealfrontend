// Modern Design Tokens for Reveal - Premium Emerald & Slate Aesthetic
export const colors = {
  // Primary brand colors (Emerald)
  primary: '#10B981', 
  primaryDark: '#059669',
  primaryLight: '#34D399',
  primaryUltraLight: '#ECFDF5',
  
  // Secondary / Accent (Indigo / Slate)
  secondary: '#6366F1', 
  secondaryDark: '#4F46E5',
  
  // Neutral / Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC', // Slate 50
  backgroundTertiary: '#F1F5F9', // Slate 100
  
  // Text
  text: '#0F172A', // Slate 900
  textSecondary: '#475569', // Slate 600
  textLight: '#94A3B8', // Slate 400
  textOnPrimary: '#FFFFFF',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B', // Amber 500
  error: '#EF4444', // Red 500
  info: '#3B82F6', // Blue 500
  
  // UI elements
  border: '#E2E8F0', // Slate 200
  borderLight: '#F1F5F9', // Slate 100
  shadow: '#00000008',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.4)',
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const typography = {
  h1: { fontSize: 34, fontWeight: '800' as const, lineHeight: 42, letterSpacing: -0.5 },
  h2: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36, letterSpacing: -0.4 },
  h3: { fontSize: 22, fontWeight: '700' as const, lineHeight: 30, letterSpacing: -0.3 },
  h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  bodyLarge: { fontSize: 17, fontWeight: '400' as const, lineHeight: 26 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  small: { fontSize: 11, fontWeight: '600' as const, lineHeight: 16, textTransform: 'uppercase' as const },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 30,
  xxl: 40,
  full: 9999,
};

