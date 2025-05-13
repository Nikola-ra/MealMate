import { Image, Pressable, Text, TextInput, View } from "react-native"
import React, { useState, useEffect, useRef } from "react"
import { useSignIn } from "@clerk/clerk-expo"
import { Link } from "expo-router"
import CustomInput from "@/components/CustomInput"

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const isMounted = useRef(true) // Track if the component is mounted

  useEffect(() => {
    return () => {
      isMounted.current = false // Set to false when unmounted
    }
  }, [])

  async function onSignInPress() {
    if (!isLoaded) return

    setLoading(true)
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (isMounted.current) {
        await setActive({ session: completeSignIn.createdSessionId })
      }
    } catch (err: any) {
      if (isMounted.current) {
        alert(err.errors[0].message)
      }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }

  return (
    <View className="flex flex-col items-center gap-4 h-screen justify-center p-4 bg-white">
      <Image
        source={require("@/assets/images/Bianco.png")}
        className="w-full h-32 mb-16"
      />

      <CustomInput
        label="E-mail"
        placeholder="youremail@gmail.com"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />

      <CustomInput
        label="Password"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <Pressable
        className="bg-green-500 px-6 py-3 rounded-lg my-4"
        onPress={onSignInPress}
      >
        <Text className="text-white font-bold text-xl">Login</Text>
      </Pressable>

      <Link href="/reset" asChild>
        <Pressable>
          <Text className="text-green-500 underline">Forgot password?</Text>
        </Pressable>
      </Link>

      <Link href="/register" asChild>
        <Pressable>
          <Text className="text-green-500 underline">Create Account</Text>
        </Pressable>
      </Link>
    </View>
  )
}
