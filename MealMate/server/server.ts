import "tsconfig-paths/register"
const express = require("express")
import clerkWebhookRouter from "./api/webhooks/clerk/route"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.EXPO_PUBLIC_PORT || 3000

// Middleware
app.use(express.json()) // For JSON parsing
app.use(express.urlencoded({ extended: true })) // For URL-encoded payloads
app.use(express.raw({ type: "application/json" })) // For raw JSON (Clerk needs this)

// Routes
app.use("/api/webhooks/clerk", clerkWebhookRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
