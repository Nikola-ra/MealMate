import { connectDB } from "../db/mongo"
import { User } from "../../schemas/User"

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

export async function createUser({ user }: { user: any }) {
  await connectDB()

  try {
    const newUser = new User(user)
    await newUser.save()
    return newUser
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}
