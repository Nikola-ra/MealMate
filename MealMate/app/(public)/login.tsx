import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
import React, { useState } from "react"
import Spinner from "react-native-loading-spinner-overlay"
import { useSignIn } from "@clerk/clerk-expo"
import { Link } from "expo-router"

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn()

  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const onSignInPress = async () => {
    if (!isLoaded) return

    setLoading(true)
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId })
    } catch (err: any) {
      alert(err.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View>
      <Spinner visible={loading} />

      <TextInput
        autoCapitalize="none"
        placeholder="simon@galaxies.aimen"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button onPress={onSignInPress} title="Login" color={"#6c47ff"}></Button>

      <Link href="/reset" asChild>
        <Pressable>
          <Text>Forgot password?</Text>
        </Pressable>
      </Link>
      <Link href="/register" asChild>
        <Pressable>
          <Text>Create Account</Text>
        </Pressable>
      </Link>
    </View>
  )
}
