import { Product } from "@/schemas/Product"
import { User } from "@/schemas/User"
import { connectDB } from "./mongo"
import mongoose from "mongoose"

export async function newProduct({
  userId,
  barCode,
  expiresAt, // New optional expiry date
}: {
  userId: string
  barCode: string
  expiresAt?: Date
}) {
  await connectDB()

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barCode}.json`
    )

    if (!response.ok) {
      throw new Error("Error fetching product")
    }

    const data = await response.json()

    if (!data.product) {
      throw new Error("Product not found")
    }

    const productData = {
      barcode: barCode,
      name: data.product.product_name || "Unknown Product",
      imageUrl: data.product.image_url || "",
      description: data.product.ingredients_text || "No ingredients",
    }

    let product = await Product.findOne({ barcode: barCode })

    if (product) {
      product.count += 1
      await product.save()
    } else {
      product = new Product({ ...productData, count: 1 })
      await product.save()
    }

    const user = await User.findOne({ clerkUserId: userId })

    if (!user) {
      throw new Error("User not found")
    }

    const existingProduct = user.ingredients.find(
      item =>
        item.productId.toString() ===
        (product._id as mongoose.Types.ObjectId).toString()
    )

    if (existingProduct) {
      // Update expiry date if provided
      if (expiresAt) {
        existingProduct.expiresAt = expiresAt
      }
    } else {
      user.ingredients.push({
        productId: product._id as any, // Ensure it's a valid ObjectId
        expiresAt: expiresAt || null,
      })
    }

    await user.save()
    return product
  } catch (error) {
    console.error("Error handling product:", error)
    return null
  }
}

export async function getUserProducts(userId: string) {
  await connectDB()

  const user = await User.findOne({ clerkUserId: userId }).populate({
    path: "ingredients.productId",
    select: "barcode name imageUrl description",
  })
  if (!user) {
    throw new Error("User not found")
  }

  return user.ingredients.map((ingredient: any) => ({
    barcode: ingredient.productId.barcode || "N/A",
    name: ingredient.productId.name || "Unknown Product",
    imageUrl: ingredient.productId.imageUrl || "",
    expiresAt: ingredient.expiresAt || null,
    description: ingredient.productId.description || "No description available",
  }))
}
