import { Stack } from "expo-router"
import React from "react"

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#6c47ff",
        },
        headerTintColor: "#fff",
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      ></Stack.Screen>

      <Stack.Screen
        name="register"
        options={{ headerShown: false }}
      ></Stack.Screen>

      <Stack.Screen
        name="reset"
        options={{ headerShown: false }}
      ></Stack.Screen>
    </Stack>
  )
}
