import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Search, Car, Users, User } from 'lucide-react-native';
import { COLORS, FONTS } from '../../src/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.navy,
        tabBarInactiveTintColor: '#8E9CB2',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
              <Search size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="mis-viajes"
        options={{
          title: 'Viajes',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
              <Car size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="comunidad"
        options={{
          title: 'Comunidad',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
              <Users size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
              <User size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEFF8',
    height: Platform.OS === 'ios' ? 86 : 68,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
    shadowColor: '#0E2A5E',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  tabItem: {
    minHeight: 48, // Mínimo 44px
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs, // Mínimo 12px
    fontWeight: '600',
    marginTop: 2,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  activeIconWrapper: {
    transform: [{ scale: 1.08 }],
  },
});
