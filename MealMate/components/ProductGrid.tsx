import React from "react"
import { Text, View } from "react-native"

export default function ProductGrid({
  products,
}: {
  products: {
    barcode: string
    name: string
    imageUrl: string
    description: string
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
    <div className="bg-white p-4 m-2 rounded-lg shadow-md">
      <Text className="text-3xl font-bold">{name}</Text>
      <Text>{description}</Text>
    </div>
  )
}
