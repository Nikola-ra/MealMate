import { useUser } from "@clerk/clerk-expo"
import { ScrollView, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import ScanButton from "@/components/ScanButton"
import ProductGrid from "@/components/ProductGrid"
import ExpiryModal from "@/components/ExpiryModal"

export default function HomePage() {
  const { user } = useUser()
  if (user == null) return null
  const id = user.id
  const [products, setProducts] = useState([])
  const [modalVisible, setModalVisible] = useState(false)

  const [currentProductId, setCurrentProductId] = useState<string | null>(null)

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

  function handleSubmit(productId: string, expiryDate: Date | null) {
    // if (!productId || !expiryDate) {
    //   console.error("Product ID and expiry date are required.")
    //   return
    // }

    fetch(
      `http://${process.env.EXPO_PUBLIC_SOCKET}/products/${productId}/edit`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          expiryDate: expiryDate?.toISOString(),
        }),
      }
    )
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        console.log("Product updated successfully:", data)
        fetchProducts() // Refresh the product list after update
      })
      .catch(error => {
        console.error("Error updating product:", error)
      })

    setModalVisible(false)
  }

  return (
    <View className="relative flex flex-1 h-screen">
      <ProductGrid products={products} />
      <ExpiryModal
        isVisible={modalVisible}
        onClose={() => {
          setModalVisible(false)
        }}
        onSubmit={handleSubmit}
        productId={currentProductId || ""}
      />
      <ScanButton
        className="absolute bottom-5 right-3"
        userId={id}
        refreshProducts={fetchProducts}
        setModalVisible={setModalVisible}
        setCurrentProductId={setCurrentProductId}
      />
    </View>
  )
}
