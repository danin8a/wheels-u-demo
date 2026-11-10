import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useChatStore } from '../../stores/useChatStore';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';

export const NotificationToast: React.FC = () => {
  const notification = useChatStore((s) => s.latestNotification);
  const clearNotification = useChatStore((s) => s.clearNotification);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={clearNotification}
      style={styles.container}
    >
      <View style={styles.bubble}>
        <View style={styles.dot} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.body} numberOfLines={2}>
            {notification.body}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  bubble: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.family,
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONTS.sizes.sm,
  },
  body: {
    fontFamily: FONTS.family,
    color: '#FFFFFF',
    fontSize: FONTS.sizes.xs,
    marginTop: 2,
  },
});
