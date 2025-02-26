import mongoose, { Schema, Document, Model } from "mongoose"

interface IProduct extends Document {
  barcode: string // Unique product barcode
  name: string // Product name
  imageUrl: string // Product image URL
  description: string // Product details
  count: number // Number of times added
}

const productSchema = new Schema<IProduct>(
  {
    barcode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    count: { type: Number, default: 1 }, // Default count to 1
  },
  { timestamps: true }
)

export const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
)
