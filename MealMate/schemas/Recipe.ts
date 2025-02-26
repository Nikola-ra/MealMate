import mongoose, { Schema, Document, Model } from "mongoose"

interface IRecipe extends Document {
  title: string
  description: string
  ingredients: string[]
  instructions: string
}

const recipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, required: true },
  },
  { timestamps: true }
)

export const Recipe: Model<IRecipe> = mongoose.model<IRecipe>(
  "Recipe",
  recipeSchema
)
