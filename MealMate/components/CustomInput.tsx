import { Text, TextInput, View } from "react-native"
import React, { useState } from "react"
export default function CustomInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}: {
  label: string
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  secureTextEntry?: boolean
}) {
  return (
    <View className="relative w-4/5">
      <Text className="absolute -top-3 left-4 z-50 bg-white px-1 text-green-500">
        {label}
      </Text>
      <TextInput
        className="border-2 border-green-500 rounded-lg w-full py-3 px-4"
        autoCapitalize="none"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  )
}
