import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'yellow' | 'navy' | 'support' | 'outline' | 'success';
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'support',
  icon,
  style,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'yellow':
        return styles.yellowBg;
      case 'navy':
        return styles.navyBg;
      case 'outline':
        return styles.outlineBg;
      case 'success':
        return styles.successBg;
      case 'support':
      default:
        return styles.supportBg;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'yellow':
        return styles.yellowText;
      case 'navy':
        return styles.navyText;
      case 'outline':
        return styles.outlineText;
      case 'success':
        return styles.successText;
      case 'support':
      default:
        return styles.supportText;
    }
  };

  return (
    <View style={[styles.container, getContainerStyle(), style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.text, getTextStyle()]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs, // Mínimo 12px
    fontWeight: '600',
  },
  yellowBg: {
    backgroundColor: COLORS.primary,
  },
  yellowText: {
    color: COLORS.navy,
  },
  navyBg: {
    backgroundColor: COLORS.navy,
  },
  navyText: {
    color: '#FFFFFF',
  },
  supportBg: {
    backgroundColor: '#E8ECF5',
  },
  supportText: {
    color: COLORS.support,
  },
  outlineBg: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.navy,
  },
  outlineText: {
    color: COLORS.navy,
  },
  successBg: {
    backgroundColor: '#D1FAE5',
  },
  successText: {
    color: '#065F46',
  },
});
