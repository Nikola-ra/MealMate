import { useUser } from "@clerk/clerk-expo"
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import React, { useEffect, useRef, useState } from "react"
import ScanButton from "@/components/ScanButton"
import ProductGrid from "@/components/ProductGrid"
import ExpiryModal from "@/components/ExpiryModal"
import DeleteProductModal from "@/components/DeleteProductModal"
import LottieView from "lottie-react-native"
import ErrorModal from "@/components/ErrorModal"

export default function HomePage() {
  const { user } = useUser()
  if (user == null) return null
  const id = user.id

  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [expiryModalVisible, setExpiryModalVisible] = useState(false)
  const [currentProductId, setCurrentProductId] = useState<string | null>(null)

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [currentBarcode, setCurrentBarcode] = useState<string | null>(null)

  const [errorModalVisible, setErrorModalVisible] = useState(false)

  const animation = useRef<LottieView>(null)
  //animation
  useEffect(() => {
    animation.current?.play()
  }, [])

  function handleDelete(barcode: string) {
    setCurrentBarcode(barcode)
    console.log(currentBarcode)
    setDeleteModalVisible(true)
  }

  function fetchProducts() {
    if (!id) return
    fetch(`${process.env.EXPO_PUBLIC_NGROK}/products/${id}`, {
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
        setLoading(false)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [id])

  function handleSubmit(productId: string, expiryDate: Date | null) {
    fetch(`${process.env.EXPO_PUBLIC_NGROK}/products/${productId}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
        expiryDate: expiryDate?.toISOString(),
      }),
    })
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

    setExpiryModalVisible(false)
  }

  function handleDeleteProduct() {
    if (currentBarcode) {
      fetch(`${process.env.EXPO_PUBLIC_NGROK}/products/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          barcode: currentBarcode,
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          return response.json()
        })
        .then(data => {
          console.log("Product deleted successfully:", data)
          fetchProducts() // Refresh the product list after deletion
        })
        .catch(error => {
          console.error("Error deleting product:", error)
        })
        .finally(() => {
          setDeleteModalVisible(false)
          setCurrentBarcode(null)
        })
    }
  }

  if (loading) {
    return (
      <View className="flex-1 w-full justify-center items-center gap-5">
        <Text className="text-2xl font-semibold">
          Fetching your products...
        </Text>
        <ActivityIndicator size="large" color="#008000" />
      </View>
    )
  } else {
    if (products.length == 0) {
      return (
        <View className="w-full flex-1 flex items-center justify-center">
          <Text className="text-2xl font-semibold">Add your first product</Text>
          <LottieView
            ref={animation}
            source={require("@/assets/animations/noProducts.json")}
            autoPlay
            loop
            style={styles.lottie}
          />
          <ScanButton
            className="absolute bottom-5 right-3"
            userId={id}
            refreshProducts={fetchProducts}
            setModalVisible={setExpiryModalVisible}
            setCurrentProductId={setCurrentProductId}
            setErrorModalVisible={setErrorModalVisible}
          />
        </View>
      )
    }
    return (
      <View className="relative flex flex-1 h-screen">
        <ProductGrid products={products} onDelete={handleDelete} />
        <ExpiryModal
          isVisible={expiryModalVisible}
          onClose={() => {
            setExpiryModalVisible(false)
          }}
          onSubmit={handleSubmit}
          productId={currentProductId || ""}
        />
        <ErrorModal
          isVisible={errorModalVisible}
          onClose={() => setErrorModalVisible(false)}
          additionalText="Maybe scan again or check if it is food that you're scanning!"
        ></ErrorModal>
        <DeleteProductModal
          isVisible={deleteModalVisible}
          onDelete={handleDeleteProduct}
          onClose={() => setDeleteModalVisible(false)}
        ></DeleteProductModal>
        <ScanButton
          className="absolute bottom-5 right-3"
          userId={id}
          refreshProducts={fetchProducts}
          setModalVisible={setExpiryModalVisible}
          setCurrentProductId={setCurrentProductId}
          setErrorModalVisible={setErrorModalVisible}
        />
      </View>
    )
  }
}

const { width } = Dimensions.get("window")
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: width * 0.6,
    height: width * 0.6,
  },
})
