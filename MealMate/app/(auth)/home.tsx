import { useUser } from "@clerk/clerk-expo"
import { ScrollView, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import ScanButton from "@/components/ScanButton"
import ProductGrid from "@/components/ProductGrid"

export default function HomePage() {
  const { user } = useUser()
  if (user == null) return null
  const id = user.id
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [products, setProducts] = useState([])

  function fetchProducts() {
    if (!id) return
    fetch(`http://${process.env.EXPO_PUBLIC_SOCKET}/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        setProducts(data.products)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [id])

  // console.log(
  //   "Type of products:",
  //   console.log(Array.isArray(products)),
  //   "Value:",
  //   products
  // )

  return (
    <View className="relative flex flex-1 h-screen">
      {/* <Text className="font-bold text-gray-900 text-3xl p-4">
        {user.emailAddresses[0].emailAddress}
        Your Products
      </Text> */}
      <ProductGrid products={products} />
      <ScanButton
        className="absolute bottom-5 right-3"
        userId={id}
        refreshProducts={fetchProducts}
      />
    </View>
  )
}
