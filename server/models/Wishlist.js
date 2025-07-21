import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    products: { 
        type: [Object]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Wishlists", WishlistSchema);
