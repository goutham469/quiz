import { View, StatusBar, Platform } from "react-native";
import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function DashboardLayout() {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "white",
      }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/icons/home.png")}
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="test"
          options={{
            title: "Test",
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/icons/test.png")}
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="attempts"
          options={{
            title: "Attempts",
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/icons/attempt.png")}
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require("../../assets/icons/profile.png")}
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
