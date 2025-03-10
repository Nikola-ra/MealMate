import { Product } from "@/schemas/Product"
import { User } from "@/schemas/User"
import { connectDB } from "./mongo"

export async function newProduct({
  userId,
  barCode,
}: {
  userId: string
  barCode: string
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

    if (!user.ingredients.includes(product._id as any)) {
      user.ingredients.push(product._id as any)
      await user.save()
    }
    return product
  } catch (error) {
    console.error("Error handling product:", error)
    return null
  }
}

export async function getUserProducts(userId: string) {
  await connectDB()

  const user = await User.findOne({ clerkUserId: userId }).populate({
    path: "ingredients",
    select: "barcode name imageUrl description",
  })
  if (!user) {
    throw new Error("User not found")
  }

  return user.ingredients.map((ingredient: any) => ({
    barcode: ingredient.barcode || "N/A",
    name: ingredient.name || "Unknown Product",
    imageUrl: ingredient.imageUrl || "",
    description: ingredient.description || "No description available",
  }))
}
