import React from "react"
import { Image, ScrollView, Text, View } from "react-native"

export default function ProductGrid({
  products,
}: {
  products: {
    barcode: string
    description: string
    imageUrl: string
    expiresAt: string | null
    name: string
  }[]
}) {
  return (
    <ScrollView className="w-full p-4">
      {products.map(product => (
        <ProductCard key={product.barcode} {...product} />
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
}: {
  barcode: string
  name: string
  imageUrl: string
  expiresAt: string | null
  description: string
}) {
  return (
    <View className="bg-white flex flex-row gap-4 rounded-2xl shadow-md p-4 mb-4 mx-2">
      <Image
        className="w-24 h-24 rounded-lg"
        source={{ uri: imageUrl }}
        resizeMode="cover"
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
    </View>
  )
}
