import { Button, Image, Pressable, Text, TextInput, View } from "react-native"
import React, { useEffect, useRef, useState } from "react"
import { useSignUp } from "@clerk/clerk-expo"
import { Stack } from "expo-router"
import Spinner from "react-native-loading-spinner-overlay"
import CustomInput from "@/components/CustomInput"

export default function signUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()

  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const isMounted = useRef(true) // Track if the component is mounted

  useEffect(() => {
    return () => {
      isMounted.current = false // Set to false when unmounted
    }
  }, [])

  async function onSignUpPress() {
    if (!isLoaded) return

    if (!emailAddress || !password) {
      alert("Please enter both email and password.")
      return
    }
    setLoading(true)

    try {
      // Create the user on Clerk
      if (isMounted.current) {
        await signUp.create({
          emailAddress,
          password,
        })

        // Send verification Email
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

        // change the UI to verify the email address
        setPendingVerification(true)
      }
    } catch (err: any) {
      if (isMounted.current) {
        alert(
          err.errors[0]?.message || "Something went wrong. Please try again."
        )
      }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }
  async function onPressVerify() {
    if (!isLoaded) {
      return
    }
    setLoading(true)

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      await setActive({ session: completeSignUp.createdSessionId })
    } catch (err: any) {
      alert(JSON.stringify(err.errors[0].message, null, 2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex flex-col items-center gap-4 h-screen justify-center p-4 bg-white">
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      <Spinner visible={loading} />

      {!pendingVerification && (
        <>
          <Image
            source={require("@/assets/images/Bianco.png")}
            className="w-full h-32 mb-16"
          />
          <CustomInput
            label="E-mail"
            placeholder="example@gmail.com"
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
            onPress={onSignUpPress}
          >
            <Text className="text-white font-bold text-xl">Register</Text>
          </Pressable>
        </>
      )}

      {pendingVerification && (
        <View className="flex flex-col items-center gap-4 h-screen justify-center p-4 bg-white">
          <Image
            source={require("@/assets/images/Bianco.png")}
            className="w-full h-32 mb-16"
          />
          <CustomInput
            label="Code"
            placeholder="Your code..."
            value={code}
            onChangeText={setCode}
          />
          <Pressable
            className="bg-green-500 px-6 py-3 rounded-lg my-4"
            onPress={onPressVerify}
          >
            <Text className="text-white font-bold text-xl">Create Account</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}
