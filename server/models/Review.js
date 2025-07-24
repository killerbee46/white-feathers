import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref:"Users",
      required: true,
    },
    objectId: {
      type: mongoose.ObjectId,
      ref:"Products",
    },
    type: {
      type: String,
      enum:['product', 'testimonial'],
      required: true,
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reviews", ReviewSchema);
