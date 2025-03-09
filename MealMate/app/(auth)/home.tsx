import { useUser } from "@clerk/clerk-expo"
import { useEffect, useState } from "react"
import { Text, View } from "react-native"
import React from "react"
import { getUserProducts } from "@/server/db/products"
import ScanButton from "@/components/ScanButton"

export default function HomePage() {
  const { user } = useUser()
  if (user == null) return null

  const id = user.id

  const [products, setProducts] = useState<
    { barcode: string; name: string; imageUrl: string; description: string }[]
  >([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const userProducts = await getUserProducts(id) // Await the async function
        setProducts(userProducts) // Store fetched products in state
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [id])

  return (
    <View className="relative flex flex-1 items-center h-screen">
      <Text className="font-semibold text-red-600 text-3xl">
        Hello {user.emailAddresses[0].emailAddress}
      </Text>
      {/* <ProductGrid products={products} /> */}
      <ScanButton userId={id} className="absolute bottom-5 right-3" />
    </View>
  )
}
