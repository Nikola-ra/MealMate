import { useUser } from "@clerk/clerk-expo"
import { Text, View } from "react-native"
import React from "react"
import ScanButton from "@/components/ScanButton"

export default function HomePage() {
  const { user } = useUser()
  if (user == null) return null

  const id = user.id
  console.log(id)

  return (
    <View className="relative flex flex-1 items-center h-screen">
      <Text className="font-semibold text-red-600 text-3xl">
        Hello {user.emailAddresses[0].emailAddress}
      </Text>
      {/* <ProductGrid products={products} /> */}
      <ScanButton userId={id} className="absolute bottom-5 right-3" />
    </View>
  )
}
