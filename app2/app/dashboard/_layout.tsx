import { View, Text, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../../assets/icons/home.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="test"
        options={{
          title: 'Test',
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../../assets/icons/test.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="attempts"
        options={{
          title: 'Attempts',
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../../assets/icons/attempt.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../../assets/icons/profile.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      
    </Tabs>
  );
}
