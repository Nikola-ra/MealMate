import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo"
import { Text, View } from "react-native"
import React from "react"
import { Link } from "expo-router"

export default function Page() {
  const { user } = useUser()

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/signIn">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/signUp">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}
