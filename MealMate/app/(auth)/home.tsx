import { Text, View } from "react-native"
import React from "react"
import { useUser } from "@clerk/clerk-expo"

export default function HomePage() {
  const { user } = useUser()

  return (
    <View className="flex items-center justify-center h-full text-3xl font-semibold">
      <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
    </View>
  )
}
