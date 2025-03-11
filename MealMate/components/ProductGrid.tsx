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
    <View className="w-full">
      {products.map(product => (
        <ProductCard key={product.name} {...product} />
      ))}
    </View>
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
    <View>
      <Text className="text-3xl font-bold">{name}</Text>
      <Text>{description}</Text>
      <Image className="w-1/2 h-40" source={{ uri: imageUrl }}></Image>
    </View>
  )
}
