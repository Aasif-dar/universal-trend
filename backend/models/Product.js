import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
  name: { type: String, required: true },

  price: { type: Number, required: true },

  category: { type: String, required: true },

  type: {
    type: String,
    enum: ["men", "women", "fragrances"],
    required: true
  },

  description: String,

  images: [
    {
      type: String
    }
  ],

  isPopular: {
    type: Boolean,
    default: false
  }

},
{ timestamps: true }
);

export default mongoose.model("Product", productSchema);