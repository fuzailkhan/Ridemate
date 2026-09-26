import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii } from '@/theme';

/**
 * Bottom tab bar — mirrors the Rork prototype's 4-icon nav
 * (Rides / Live / Groups / Profile), restyled with RideMate's own theme
 * tokens rather than the prototype's literal assets. Active tabs get a
 * soft accent-tinted pill behind the icon for a slightly more premium
 * selected state than a bare color change.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accentSolid,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.backgroundElevated,
          borderTopColor: colors.borderSubtle,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 8,
          paddingBottom: 10
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Rides',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <MaterialCommunityIcons name="motorbike" size={size} color={color} />
            </TabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="live"
        options={{
          title: 'Live',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <MaterialCommunityIcons name="pulse" size={size} color={color} />
            </TabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <MaterialCommunityIcons name="account-group" size={size} color={color} />
            </TabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <MaterialCommunityIcons name="account-circle" size={size} color={color} />
            </TabIcon>
          )
        }}
      />
    </Tabs>
  );
}

function TabIcon({ focused, children }: { focused: boolean; children: React.ReactNode }) {
  return (
    <View
      style={{
        width: 40,
        height: 28,
        borderRadius: radii.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? colors.accentMuted : 'transparent'
      }}
    >
      {children}
    </View>
  );
}
