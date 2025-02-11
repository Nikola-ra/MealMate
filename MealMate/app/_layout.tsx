import { token } from "@/lib/tokenCache"
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo"
import { Href, Slot, useRouter, useSegments } from "expo-router"
import React, { useEffect } from "react"

export default function RootLayout() {
  const tokenCache = token
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    )
  }

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
    if (!isLoaded) return

    const inTabsGroup = segments[0] === "(auth)"

    const homeRoute = "/home"
    if (isSignedIn && !inTabsGroup) {
      router.replace("/home" as Href)
    } else if (!isSignedIn) {
      router.replace("/login" as Href)
    }
    console.log(isLoaded, isSignedIn)
  }, [isSignedIn])

  return <Slot />
}
