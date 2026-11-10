export const COLORS = {
  // Principales
  primary: '#FFC93C',       // Amarillo Wheels U
  navy: '#0E2A5E',          // Azul Marino Institucional
  support: '#4A5B80',       // Azul de Apoyo
  background: '#F3F5FA',    // Fondo suave
  card: '#FFFFFF',          // Blanco tarjetas
  surface: '#FFFFFF',

  // Tipografía y contrastes
  textPrimary: '#0E2A5E',   // Azul marino para títulos y lecturas clave
  textSecondary: '#4A5B80', // Azul apoyo para subtítulos
  textMuted: '#7E8CA3',     // Gris neutro
  textLight: '#FFFFFF',

  // Bordes y acentos
  border: '#E3E7F0',
  borderBold: '#0E2A5E',
  yellowSoft: '#FFF5D6',
  navySoft: '#183875',

  // Semánticos
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',
};

export const FONTS = {
  family: 'SpaceGrotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  sizes: {
    xs: 12,    // Mínimo de 12px exigido
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 26,
    hero: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 26,
  card: 26,
  pill: 9999,
};

export const TOUCH_TARGET = {
  minHeight: 48, // Mínimo 44px exigido, usando 48px para ergonomía
};
