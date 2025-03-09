import mongoose from "mongoose"
const dotenv = require("dotenv")

import Constants from "expo-constants"

<<<<<<< HEAD
<<<<<<< HEAD
const MONGO_URI = Constants.expoConfig?.extra?.EXPO_PUBLIC_MONGO_URI
=======
const MONGO_URI = process.env.MONGO_URI
>>>>>>> parent of b4542ade (Progetto prima della creazione di api enpoint per call a server side functions)
=======
const MONGO_URI = process.env.MONGO_URI
>>>>>>> parent of b4542ade (Progetto prima della creazione di api enpoint per call a server side functions)

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
      dbName:
        process.env.NODE_ENV === "production" ? "production" : "development",
    })
    console.log(`Connected to MongoDB (${process.env.NODE_ENV})`)
  } catch (error) {
    console.error("MongoDB Connection Error:", error)
    throw error
  }

  return mongoose
}
