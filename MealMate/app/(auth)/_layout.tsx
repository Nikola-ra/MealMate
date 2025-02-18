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
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="recipes"
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="cutlery" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  )
}
