import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    grossWeight: {
      type: Number,
      required: true,
    },
    materialWeight: {
      type: Number,
      required: true,
    },
    diamondWeight: {
      type: Number,
      required: true,
    },
    stoneWeight: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offers:{
      type:[String],
    },
    discountedPrice: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    giftId: {
      type: mongoose.ObjectId,
      ref: "Gift",
      required: true,
    },
    preferenceId: {
      type: mongoose.ObjectId,
      ref: "Preference",
      required: true,
    },
    materialId: {
      type: mongoose.ObjectId,
      ref: "Material",
      required: true,
    },
    metalId: {
      type: mongoose.ObjectId,
      ref: "Metal",
      required: true,
    },
    image: {
      type: String,
    },
    images:{
      type:[String]
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
