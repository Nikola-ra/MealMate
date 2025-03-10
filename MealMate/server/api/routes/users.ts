import { newProduct } from "@/server/db/products"

const express = require("express")

const router = express.Router()

router.post("/", async (req: any, res: any) => {
  try {
    const { barCode, userId } = req.body

    if (!barCode || !userId) {
      return res.status(400).json({ error: "barCode and userId are required" })
    }

    const product = await newProduct({ userId, barCode })

    if (!product || product == null) {
      return res
        .status(404)
        .json({ error: "Product not found or could not be created" })
    } else {
      res.status(201).json({ message: "Product added successfully", product })
    }
  } catch (error) {
    console.error("Error in /api/users:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
