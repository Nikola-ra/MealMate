import { useAuth } from "@clerk/clerk-expo"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import React from "react"
import { Button, Pressable, Text } from "react-native"

export default function LogoutButton() {
  const { signOut } = useAuth()
  return (
    <Pressable onPress={() => signOut()}>
      <FontAwesome name="sign-out" size={28} color="black" />
    </Pressable>
  )
}
