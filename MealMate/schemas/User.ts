import mongoose, { Schema, Document, Model } from "mongoose"

interface IUserIngredient {
  productId: mongoose.Types.ObjectId
  expiresAt?: Date | null
}

// Define the main User interface
interface IUser extends Document {
  clerkUserId: string // Clerk user ID
  ingredients: IUserIngredient[] // List of user-specific products
  recipes: mongoose.Types.ObjectId[] // List of saved recipes
  createdAt: Date
  updatedAt: Date // Fixed typo from 'updategitdAt'
}

// Define the Mongoose schema for User
const userSchema = new Schema<IUser>(
  {
    clerkUserId: { type: String, required: true, unique: true },
    ingredients: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        expiresAt: { type: Date, default: null }, // Optional expiry date for this user’s product
      },
    ],
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
)

// Export the Mongoose model
export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema)
