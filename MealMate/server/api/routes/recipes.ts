const express = require("express")
import { GoogleGenerativeAI } from "@google/generative-ai"
import { User } from "@/schemas/User"
import { connectDB } from "@/server/db/mongo"

const router = express.Router()

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

router.get("/:userId", async (req: any, res: any) => {
  const { userId } = req.params

  try {
    await connectDB()

    // Fetch the user's ingredients
    const user = await User.findOne({ clerkUserId: userId }).populate({
      path: "ingredients.productId",
      select: "name",
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const ingredientNames = user.ingredients.map(
      (ingredient: any) => ingredient.productId.name
    )

    const prompt = `Generate 5 recipes based on the following ingredients: ${ingredientNames.join(
      ", "
    )}. Each recipe should include a title, description, image URL, and a web link.`

    // Make a request to the Gemini API
    const result = await model.generateContent(prompt)

    // Parse the response (assuming the API returns JSON-like text)
    const recipes = JSON.parse(result.response.text())

    return res.status(200).json({ recipes })
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export default router
