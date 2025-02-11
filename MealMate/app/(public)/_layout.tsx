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
        options={{ headerTitle: "MealMate" }}
      ></Stack.Screen>

      <Stack.Screen
        name="register"
        options={{ headerTitle: "Create Account" }}
      ></Stack.Screen>

      <Stack.Screen
        name="reset"
        options={{ headerTitle: "Reset Password" }}
      ></Stack.Screen>
    </Stack>
  )
}
