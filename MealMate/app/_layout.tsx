import { token } from "@/lib/tokenCache"
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo"
import { Href, Slot, useRouter, useSegments } from "expo-router"
import React, { useEffect } from "react"

import "./globals.css"
import "react-native-gesture-handler"

export default function RootLayout() {
  const tokenCache = token
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  )
}

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const inTabsGroup = segments[0] === "(auth)"

    if (isSignedIn && !inTabsGroup) {
      router.replace("/home")
    } else if (!isSignedIn) {
      router.replace("/login")
    }
    console.log(isLoaded, isSignedIn)
  }, [isSignedIn])

  return <Slot />
}
