const express = require("express")
const bodyParser = require("body-parser")
import { connectDB } from "./db/mongo"
const dotenv = require("dotenv")
import clerkWebhookRouter from "../app/api/webhooks/clerk/route"

dotenv.config()

const app = express()
const PORT = process.env.PORT

//DB Connection
connectDB()

// Middleware
app.use(bodyParser.json())

//Routes
app.use("/api/webhooks/clerk", clerkWebhookRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
