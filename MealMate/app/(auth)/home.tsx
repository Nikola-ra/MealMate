import { useUser } from "@clerk/clerk-expo"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import ScanButton from "@/components/ScanButton"
import ProductGrid from "@/components/ProductGrid"
import ExpiryModal from "@/components/ExpiryModal"
import DeleteProductModal from "@/components/DeleteProductModal"

export default function HomePage() {
  const { user } = useUser()
  if (user == null) return null
  const id = user.id
  const [products, setProducts] = useState([])
  const [expiryModalVisible, setExpiryModalVisible] = useState(false)
  const [currentProductId, setCurrentProductId] = useState<string | null>(null)

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [currentBarcode, setCurrentBarcode] = useState<string | null>(null)

  function handleDelete(barcode: string) {
    setCurrentBarcode(barcode)
    console.log(currentBarcode)
    setDeleteModalVisible(true)
  }

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

    setExpiryModalVisible(false)
  }

  function handleDeleteProduct() {
    if (currentBarcode) {
      fetch(`http://${process.env.EXPO_PUBLIC_SOCKET}/products/delete`, {
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

  if (products.length == 0) {
    return (
      <View className="h-screen w-full flex justify-center items-center">
        <ActivityIndicator color="00ff00" size="large" />
      </View>
    )
  } else {
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
        />
      </View>
    )
  }
}
