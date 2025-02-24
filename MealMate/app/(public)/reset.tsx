import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Text,
  Image,
} from "react-native"
import React, { useState } from "react"
import { Stack } from "expo-router"
import { useSignIn } from "@clerk/clerk-expo"
import CustomInput from "@/components/CustomInput"

export default function ResetPage() {
  const { signIn, setActive } = useSignIn()
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [successfulCreation, setSuccessfulCreation] = useState(false)

  if (!setActive) {
    return null
  }
  // Request a passowrd reset code by email
  const onRequestReset = async () => {
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      })
      setSuccessfulCreation(true)
    } catch (err: any) {
      alert(err.errors[0].message)
    }
  }

  // Reset the password with the code and the new password
  const onReset = async () => {
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      console.log(result)
      alert("Password reset successfully")

      // Set the user session active, which will log in the user automatically
      await setActive({ session: result?.createdSessionId })
    } catch (err: any) {
      alert(err.errors[0].message)
    }
  }

  return (
    <View className="flex flex-col items-center gap-4 h-screen justify-center p-4 bg-white">
      <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />

      {!successfulCreation && (
        <>
          <Image
            source={require("@/assets/images/Bianco.png")}
            className="w-full h-32 mb-16"
          />
          <CustomInput
            label="E-mail"
            placeholder="Your account email"
            value={emailAddress}
            onChangeText={setEmailAddress}
          />

          <Pressable
            className="bg-green-500 px-6 py-3 rounded-lg my-4"
            onPress={onRequestReset}
          >
            <Text className="text-white font-bold text-xl">
              Change Password
            </Text>
          </Pressable>
        </>
      )}

      {successfulCreation && (
        <>
          <View className="flex flex-col items-center gap-4 h-screen justify-center p-4">
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

            <CustomInput
              label="New Password"
              placeholder="Enter New Password"
              value={password}
              onChangeText={setPassword}
            />

            <Pressable
              className="bg-green-500 px-6 py-3 rounded-lg my-4"
              onPress={onReset}
            >
              <Text className="text-white font-bold text-xl">
                Change Password
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  )
}
