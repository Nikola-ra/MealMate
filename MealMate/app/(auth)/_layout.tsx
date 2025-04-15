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
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome
                size={28}
                name="home"
                color={focused ? "#22c55e" : "gray"}
              />
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
            tabBarActiveTintColor: "green",
            tabBarInactiveTintColor: "gray",
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome
                size={28}
                name="cutlery"
                color={focused ? "#22c55e" : "gray"}
              />
            ),
          }}
        />
      </Tabs>
    </>
  )
}
