import React, { useState } from "react"
import { Image, ScrollView, Text, View } from "react-native"
import { TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function ProductGrid({
  products,
  onDelete,
}: {
  products: {
    barcode: string
    description: string
    imageUrl: string
    expiresAt: string | null
    name: string
  }[]
  onDelete: (barcode: string) => void
}) {
  return (
    <ScrollView className="w-full">
      {products.map(product => (
        <ProductCard key={product.barcode} {...product} onDelete={onDelete} />
      ))}
    </ScrollView>
  )
}

function ProductCard({
  barcode,
  name,
  imageUrl,
  expiresAt,
  description,
  onDelete,
}: {
  barcode: string
  name: string
  imageUrl: string
  expiresAt: string | null
  description: string
  onDelete: (barcode: string) => void
}) {
  return (
    <View className="bg-white flex flex-row gap-4 shadow-sm px-4 py-5 border-b-[0.8px] border-gray-400">
      <Image
        className="w-24 h-24 rounded-lg"
        source={{ uri: imageUrl }}
        resizeMode="contain"
      />
      <View className="flex flex-col justify-between">
        <Text className="text-xl font-semibold text-gray-800 flex-1">
          {name}
        </Text>

        <Text className="text-sm font-normal text-gray-500">
          {expiresAt == null
            ? "Expires at : Not Specified"
            : `Expires at : ${new Date(expiresAt).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}`}
        </Text>
      </View>

      <TouchableOpacity
        className="block ml-auto"
        onPress={() => onDelete(barcode)}
      >
        <Ionicons className="opacity-40" name="trash" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  )
}
