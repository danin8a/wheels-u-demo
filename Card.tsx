import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'white' | 'navy' | 'yellow' | 'outline';
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'white',
  noPadding = false,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'navy':
        return styles.navy;
      case 'yellow':
        return styles.yellow;
      case 'outline':
        return styles.outline;
      case 'white':
      default:
        return styles.white;
    }
  };

  return (
    <View
      style={[
        styles.base,
        getVariantStyle(),
        noPadding ? undefined : styles.padding,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.card, // 26px esquinas muy redondeadas
    overflow: 'hidden',
  },
  padding: {
    padding: SPACING.lg,
  },
  white: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: '#E8ECF4',
    shadowColor: '#0E2A5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  navy: {
    backgroundColor: COLORS.navy,
  },
  yellow: {
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: COLORS.navy,
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: COLORS.navy,
  },
});
