import "tsconfig-paths/register"
const express = require("express")
const dotenv = require("dotenv")
import clerkWebhookRouter from "./api/webhooks/clerk/route"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json()) // For JSON parsing
app.use(express.urlencoded({ extended: true })) // For URL-encoded payloads
app.use(express.raw({ type: "application/json" })) // For raw JSON (Clerk needs this)

// Routes
app.use("/api/webhooks/clerk", clerkWebhookRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
