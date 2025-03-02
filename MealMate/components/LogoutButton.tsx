import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/clerk-expo"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useInteropClassName } from "expo-router/build/link/useLinkHooks"
import React from "react"
import { Button, Pressable, Text } from "react-native"

export default function LogoutButton({
  className = "",
}: {
  className?: string
}) {
  const { signOut } = useAuth()
  return (
    <Pressable className={cn(className)} onPress={() => signOut()}>
      <FontAwesome name="sign-out" size={28} className="fill-green-500" />
    </Pressable>
  )
}
