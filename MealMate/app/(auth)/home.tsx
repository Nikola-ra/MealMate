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

  function handleSubmit(expiryDate: Date | null) {
    console.log("Selected Expiry Date:", expiryDate)

    //TODO

    // fetch(`http://${process.env.EXPO_PUBLIC_SOCKET}/products`, {
    //   headers: {
    //     method: "PUT",
    //   },
    // })
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
      />
      <ScanButton
        className="absolute bottom-5 right-3"
        userId={id}
        refreshProducts={fetchProducts}
        setModalVisible={setModalVisible}
      />
    </View>
  )
}
