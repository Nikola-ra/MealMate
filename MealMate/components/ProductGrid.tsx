import React from "react"
import { Image, ScrollView, Text, View } from "react-native"

export default function ProductGrid({
  products,
}: {
  products: {
    barcode: string
    description: string
    imageUrl: string
    name: string
  }[]
}) {
  return (
    <ScrollView className="w-full p-4">
      {products.map(product => (
        <ProductCard key={product.name} {...product} />
      ))}
    </ScrollView>
  )
}

function ProductCard({
  barcode,
  name,
  imageUrl,
  description,
}: {
  barcode: string
  name: string
  imageUrl: string
  description: string
}) {
  return (
    <View className="bg-white flex flex-row gap-4 rounded-2xl shadow-md p-4 mb-4 mx-2">
      <Image
        className="w-24 h-24 rounded-lg"
        source={{ uri: imageUrl }}
        resizeMode="cover"
      />
      <Text className="text-xl font-semibold text-gray-800 flex-1">{name}</Text>
    </View>
  )
}
