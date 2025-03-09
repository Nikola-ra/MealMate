const express = require("express")
const clerkWebhookRouter = require("./api/webhooks/clerk/route")
const usersRouter = require("./api/routes/users")

const dotenv = require("dotenv")
dotenv.config()

const app = express()
const PORT = process.env.EXPO_PUBLIC_PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.raw({ type: "application/json" }))

// Routes
app.use("/api/webhooks/clerk", clerkWebhookRouter)
app.use("/api/routes/users", usersRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
