import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2D8CFF',
        tabBarInactiveTintColor: '#FFFFFF',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: '#000000',
            borderTopColor: '#FFFFFF',
            borderTopWidth: 1,
          },
          default: {
            backgroundColor: '#000000',
            borderTopColor: '#FFFFFF',
            borderTopWidth: 1,
          },
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '400',
          },
          tabBarIcon: ({ color }) => <Ionicons size={24} name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="conversations"
        options={{
          title: 'Conversations',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '400',
          },
          tabBarIcon: ({ color }) => <Ionicons size={24} name="chatbubble-ellipses-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="preferences"
        options={{
          title: 'Preferences',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '400',
          },
          tabBarIcon: ({ color }) => <Ionicons size={24} name="settings-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
