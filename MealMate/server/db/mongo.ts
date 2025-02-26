import mongoose from "mongoose"
const dotenv = require("dotenv")

dotenv.config()

const MONGO_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_DEV

if (!MONGO_URI) {
  throw new Error("MongoDB URI is missing!")
}

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to MongoDB.")
    return mongoose
  }

  try {
    await mongoose.connect(MONGO_URI as string, {
      dbName: process.env.NODE_ENV === "production" ? "production" : "dev",
    })
    console.log(`Connected to MongoDB (${process.env.NODE_ENV})`)
  } catch (error) {
    console.error("MongoDB Connection Error:", error)
    throw error
  }

  return mongoose
}
