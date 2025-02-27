import mongoose, { Schema, Document, Model } from "mongoose"

interface IUser extends Document {
  clerkUserId: string // Clerk user ID
  ingredients: mongoose.Types.ObjectId[] // List of scanned product IDs
  recipes: mongoose.Types.ObjectId[] // List of saved recipes
  createdAt: Date
  updategitdAt: Date
}

const userSchema = new Schema<IUser>(
  {
    clerkUserId: { type: String, required: true, unique: true },
    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { timestamps: true }
)

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema)
