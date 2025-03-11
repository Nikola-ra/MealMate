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

  useEffect(() => {
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
        // console.log("Fetched products : ", data.products)
        setProducts(data.products)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
      })
  }, [id])

  // console.log(
  //   "Type of products:",
  //   console.log(Array.isArray(products)),
  //   "Value:",
  //   products
  // )

  return (
    <ScrollView className="relative flex flex-1 h-screen">
      <Text className="font-semibold text-red-600 text-3xl">
        Hello {user.emailAddresses[0].emailAddress}
      </Text>
      <ProductGrid products={products} />
      <ScanButton userId={id} className="absolute bottom-5 right-3" />
    </ScrollView>
  )
}
