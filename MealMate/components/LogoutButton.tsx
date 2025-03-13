import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/clerk-expo"
import FontAwesome from "@expo/vector-icons/FontAwesome"
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
      <FontAwesome name="sign-out" size={28} color="#5c5c5c" />
    </Pressable>
  )
}
