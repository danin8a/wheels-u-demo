import React from 'react';
import { View, StyleSheet, Text as RNText, Platform } from 'react-native';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';
import { COLORS, FONTS } from '../../constants/theme';

interface WheelsULogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  pinColor?: string;
  uColor?: string;
  dotColor?: string;
  ringColor?: string;
  vertical?: boolean;
  textSize?: number;
}

export const WheelsULogo: React.FC<WheelsULogoProps> = ({
  size = 48,
  showText = false,
  textColor = COLORS.navy,
  pinColor = COLORS.navy,
  uColor = COLORS.primary,
  dotColor = '#FFFFFF',
  ringColor = COLORS.navy,
  vertical = false,
  textSize,
}) => {
  // Dimensiones del pin viewBox: 0 0 100 120
  // Pin con aro en la base (y=112, rx=24, ry=6)
  // Pin body desde y=10 hasta y=98
  // Letra U centrada adentro
  // Punto blanco en (76, 24)

  const pinWidth = size;
  const pinHeight = (size * 120) / 100;

  return (
    <View style={[styles.container, vertical ? styles.vertical : styles.horizontal]}>
      <Svg
        width={pinWidth}
        height={pinHeight}
        viewBox="0 0 100 120"
        fill="none"
      >
        {/* Aro/Halo elíptico en la base */}
        <Ellipse
          cx="50"
          cy="112"
          rx="26"
          ry="6"
          stroke={ringColor}
          strokeWidth="3.5"
          fill="none"
          opacity="0.85"
        />

        {/* Pin de ubicación */}
        <Path
          d="M50 10 C30.67 10 15 25.67 15 45 C15 70 44 95 50 102 C56 95 85 70 85 45 C85 25.67 69.33 10 50 10 Z"
          fill={pinColor}
        />

        {/* Letra 'U' en amarillo en el centro del pin */}
        <Path
          d="M38 32 V50 C38 56.63 43.37 62 50 62 C56.63 62 62 56.63 62 50 V32 H54 V50 C54 52.21 52.21 54 50 54 C47.79 54 46 52.21 46 50 V32 H38 Z"
          fill={uColor}
        />

        {/* Punto blanco de brillo/destello en la esquina superior derecha */}
        <Circle
          cx="71"
          cy="26"
          r="4.2"
          fill={dotColor}
        />
      </Svg>

      {showText && (
        <RNText
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: textSize || Math.max(16, size * 0.42),
              marginLeft: vertical ? 0 : 8,
              marginTop: vertical ? 8 : 0,
            },
          ]}
        >
          Wheels <RNText style={{ color: COLORS.primary }}>U</RNText>
        </RNText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  text: {
    fontFamily: FONTS.family,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});
