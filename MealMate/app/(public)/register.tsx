import { Button, Text, TextInput, View } from "react-native"
import React, { useState } from "react"
import { useSignUp } from "@clerk/clerk-expo"
import { Stack } from "expo-router"
import Spinner from "react-native-loading-spinner-overlay"

export default function signUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()

  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSignUpPress() {
    if (!isLoaded) return

    if (!emailAddress || !password) {
      alert("Please enter both email and password.")
      return
    }
    setLoading(true)

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
      })

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

      // change the UI to verify the email address
      setPendingVerification(true)
    } catch (err: any) {
      alert(err.errors[0]?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
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
    <View>
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      <Spinner visible={loading} />

      {!pendingVerification && (
        <>
          <TextInput
            autoCapitalize="none"
            placeholder="simon@galaxies.dev"
            value={emailAddress}
            onChangeText={setEmailAddress}
          />
          <TextInput
            placeholder="password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            onPress={onSignUpPress}
            title="Sign up"
            color={"#6c47ff"}
          ></Button>
        </>
      )}

      {pendingVerification && (
        <>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              onChangeText={setCode}
            />
          </View>
          <Button
            onPress={onPressVerify}
            title="Verify Email"
            color={"#6c47ff"}
          ></Button>
        </>
      )}
    </View>
  )
}
