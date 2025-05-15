const express = require("express")
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getUserProducts } from "@/server/db/products"

const router = express.Router()

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
})

router.get("/:userId", async (req: any, res: any) => {
  const { userId } = req.params

  try {
    const userIngredients = await getUserProducts(userId)

    const ingredientNames = userIngredients.map(item => item.name)

    if (!ingredientNames.length) {
      return res.status(204).json({ message: "zero" })
    }

    const prompt = `given the ingredients in THIS ARRAY: [${ingredientNames.join(
      ","
    )}] i want you to generate the same array but the ingredients should be translated in english and optimized for querying recipes from SpoonacularAPI, your response should only be the JSON array`

    const result = await model.generateContent({
      generationConfig: { responseMimeType: "application/json" },
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
