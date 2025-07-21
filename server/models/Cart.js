import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
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

export default mongoose.model("Carts", CartSchema);
