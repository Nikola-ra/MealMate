import {
  deleteProductFromUser,
  getUserProducts,
  newProduct,
  updateExpiryDate,
} from "@/server/db/products"

const express = require("express")

const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params
    if (!id || id == null)
      return res.status(400).json({ error: "Missing userId" })

    const userProducts = await getUserProducts(id)

    return res.status(200).json({
      message: "Products fetched Successfully!",
      products: userProducts,
    })
  } catch (error) {
    console.error("Error in /products/:id: ", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

//CREAZIONE DI UN NUOVO PRODOTTO
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

//AGGIORNAMENTO DELLA DATA DI SCADENZA DEL PRODOTTO
router.put("/:productId/edit", async (req: any, res: any) => {
  try {
    const { productId } = req.params
    const { userId, expiryDate } = req.body

    if (!productId || !userId || !expiryDate) {
      return res
        .status(400)
        .json({ error: "productId, userId, and expiryDate are required" })
    }

    await updateExpiryDate({ userId, productId, expiryDate })

    return res.status(200).json({
      message: "Expiry date updated successfully",
      productId,
      expiryDate,
    })
  } catch (error) {
    console.error("Error in updating expiry date:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/delete", async (req: any, res: any) => {
  const barcode = req.body.barcode
  console.log("body: ", req.body)
  const userId = req.body.userId
  console.log("sono ne delete", barcode, userId)
  try {
    if (!barcode || !userId) {
      return res.status(400).json({ error: "barcode and userId are required" })
    }

    console.log("sono ne delete")

    await deleteProductFromUser({ userId, barcode })

    res.status(200).json({ message: "Product deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "error deleting products (DB)" })
  }
})
export default router
