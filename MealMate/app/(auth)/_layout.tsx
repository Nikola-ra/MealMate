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
            headerTitle: "Ingredients",
            headerTitleStyle: {
              fontSize: 30,
              marginLeft: 9,
              fontWeight: "bold",
            },
            headerRight: () => <LogoutButton className="mr-5" />,
            tabBarActiveTintColor: "green",
            tabBarInactiveTintColor: "gray",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={"#22c55e"} />
            ),
          }}
        />
        <Tabs.Screen
          name="recipes"
          options={{
            headerTitle: "Recipes",
            headerTitleStyle: {
              fontSize: 30,
              marginLeft: 9,
              fontWeight: "bold",
            },
            headerRight: () => <LogoutButton className="mr-5" />,
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
