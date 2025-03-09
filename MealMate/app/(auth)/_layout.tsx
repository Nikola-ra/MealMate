import LogoutButton from "@/components/LogoutButton"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Tabs } from "expo-router"
import React from "react"

export default function HomeLayout() {
  return (
    <>
      <Tabs>
        <Tabs.Screen
          name="home"
          options={{
            headerTitle: "Home",
            headerRight: () => <LogoutButton className="mr-5" />,
            tabBarActiveTintColor: "green", // Change active tab text color
            tabBarInactiveTintColor: "gray",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={"#22c55e"} />
            ),
          }}
        />
        <Tabs.Screen
          name="recipes"
          options={{
            headerShown: false,
            tabBarActiveTintColor: "green", // Change active tab text color
            tabBarInactiveTintColor: "gray",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="cutlery" color={"#22c55e"} />
            ),
          }}
        />
      </Tabs>
    </>
  )
}
