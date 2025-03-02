import mongoose from "mongoose"
import { connectDB } from "./mongo"
import { User } from "@/schemas/User"

export async function getUsers() {
  await connectDB()

  try {
    const users = await User.find()
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export async function getUserById(id: string) {
  await connectDB()
  try {
    const user = await User.findOne({ clerkUserId: id })
    return user
  } catch (error) {
    console.error("Error fetching user by id:", error)
    throw error
  }
}

export async function createUser({
  clerkUserId,
  ingredients,
  recipes,
}: {
  clerkUserId: string
  ingredients: mongoose.Types.ObjectId[]
  recipes: mongoose.Types.ObjectId[]
}) {
  await connectDB()
  const user = { clerkUserId, ingredients, recipes }

  try {
    const newUser = new User(user)
    await newUser.save()
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}
