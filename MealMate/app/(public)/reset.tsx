import { View, StyleSheet, TextInput, Button } from "react-native"
import React, { useState } from "react"
import { Stack } from "expo-router"
import { useSignIn } from "@clerk/clerk-expo"

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
    <View>
      <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />

      {!successfulCreation && (
        <>
          <TextInput
            autoCapitalize="none"
            placeholder="simon@galaxies.dev"
            value={emailAddress}
            onChangeText={setEmailAddress}
          />

          <Button
            onPress={onRequestReset}
            title="Send Reset Email"
            color={"#6c47ff"}
          ></Button>
        </>
      )}

      {successfulCreation && (
        <>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              onChangeText={setCode}
            />
            <TextInput
              placeholder="New password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <Button
            onPress={onReset}
            title="Set new Password"
            color={"#6c47ff"}
          ></Button>
        </>
      )}
    </View>
  )
}
