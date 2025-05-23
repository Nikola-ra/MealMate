import "tsconfig-paths/register"
const express = require("express")
const dotenv = require("dotenv")
import clerkWebhookRouter from "./api/webhooks/clerk/route"
import productRouter from "./api/routes/products"
import recipesRouter from "./api/routes/recipes"
dotenv.config()

const app = express()
const PORT = process.env.EXPO_PUBLIC_PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.raw({ type: "application/json" }))

// Routes
app.use("/products", productRouter)
app.use("/api/webhooks/clerk", clerkWebhookRouter)
app.use("/recipes", recipesRouter)

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`)
})
