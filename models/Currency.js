import mongoose from "mongoose";

const CurrencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Currency", CurrencySchema);
