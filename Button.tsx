import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { COLORS, FONTS, RADIUS, TOUCH_TARGET } from '../../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'yellow' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'yellow':
        return styles.yellowBtn;
      case 'outline':
        return styles.outlineBtn;
      case 'ghost':
        return styles.ghostBtn;
      case 'danger':
        return styles.dangerBtn;
      case 'primary':
      default:
        return styles.primaryBtn;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'yellow':
        return styles.yellowText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      case 'danger':
        return styles.dangerText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.smBtn;
      case 'lg':
        return styles.lgBtn;
      case 'md':
      default:
        return styles.mdBtn;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      disabled={disabled || loading}
      style={[
        styles.base,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabledBtn,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'yellow' ? COLORS.navy : COLORS.textLight}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.baseText,
              getTextStyle(),
              icon ? { marginLeft: 8 } : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: TOUCH_TARGET.minHeight, // Mínimo 44px garantizado (48px)
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primaryBtn: {
    backgroundColor: COLORS.navy,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  yellowBtn: {
    backgroundColor: COLORS.primary,
  },
  yellowText: {
    color: COLORS.navy,
    fontWeight: '700',
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.navy,
  },
  outlineText: {
    color: COLORS.navy,
  },
  ghostBtn: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: COLORS.navy,
  },
  dangerBtn: {
    backgroundColor: COLORS.danger,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  smBtn: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
  },
  mdBtn: {
    minHeight: TOUCH_TARGET.minHeight,
  },
  lgBtn: {
    minHeight: 56,
    borderRadius: RADIUS.xl,
  },
  baseText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.md, // Mínimo > 12px
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
