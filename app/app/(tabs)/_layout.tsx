import { Tabs } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { COLORS } from '@/constants/Config';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray[600],
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e9ecef',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="house.fill" size={size} color={color} />
          ),
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="attempts"
        options={{
          title: 'Tests Attempted',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="list.bullet.clipboard.fill" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="aptitude"
        options={{
          title: 'Aptitude',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="brain.head.profile" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gk"
        options={{
          title: 'GK',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="book.fill" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="technical"
        options={{
          title: 'Technical',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="laptopcomputer" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
