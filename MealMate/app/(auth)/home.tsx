import { Text, View } from "react-native"
import React from "react"
import { useUser } from "@clerk/clerk-expo"
import LogoutButton from "@/components/LogoutButton"
import ScanButton from "@/components/ScanButton"

export default function HomePage() {
  const { user } = useUser()
  return (
    <View className="flex items-center gap-6 h-screen">
      <LogoutButton />
      <Text className="font-semibold text-red-600 text-3xl">
        Hello {user?.emailAddresses[0].emailAddress}
      </Text>
      <ScanButton />
    </View>
  )
}
