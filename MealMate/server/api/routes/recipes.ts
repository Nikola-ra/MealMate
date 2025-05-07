const express = require("express")
import { GoogleGenerativeAI } from "@google/generative-ai"
import { User } from "@/schemas/User"
import { connectDB } from "@/server/db/mongo"
import { getUserProducts } from "@/server/db/products"

const router = express.Router()

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

router.get("/:userId", async (req: any, res: any) => {
  const { userId } = req.params

  try {
    const userIngredients = await getUserProducts(userId)

    const ingredientNames = userIngredients.map(item => item.name)

    if (!ingredientNames.length) {
      return res.status(400).json({ error: "No ingredients available" })
    }

    const prompt = `Generate 7 food recipes using ONLY: [${ingredientNames.join(
      ","
    )}]. Allow only salt/oil/pepper/water as extras.

Return STRICT JSON array with:
- "title" (max 4 words)
- "features" (2-3 tags ex: "vegetarian,protein")
- "image_url" (real CC0 photo of the recipe)
- "recipe_link" (existing URL to the recipe preferrably from giallo zafferano)

Valid JSON, double quotes only. Example:
[{
  "title": "Chickpea spinach pasta",
  "features": "vegan,quick",
  "image_url": "https://example.com/img.jpg",
  "recipe_link": "https://recipesite.com/123"
}]
  
do not invent ingredients and recipes, use only the ones provided, do not get too creative, stick to findable images and links to recipes, if there are none with those ingredients, provide less or none, you do not need to use all of the ingredients provided, keep it simple.`

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    })

    const rawText = result.response.text()
    const cleanText = rawText.replace(/^```json|```$/g, "")
    const recipes = JSON.parse(cleanText)

    return res.status(200).json({ recipes })
  } catch (error) {
    console.error("Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return res.status(500).json({
      error: "Recipe generation failed",
      details: message,
    })
  }
})

export default router
