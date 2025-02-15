import { Text, View } from "react-native"
import React from "react"
import { useUser } from "@clerk/clerk-expo"

export default function HomePage() {
  const { user } = useUser()

  return (
    <View className="flex items-center justify-center h-screen">
      <Text className="text-red-600 text-3xl font font-semibold">
        Hello {user?.emailAddresses[0].emailAddress}
      </Text>
    </View>
  )
}
