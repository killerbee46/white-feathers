import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref:"Users",
      // required: true,
    },
    productId: {
      type: Number,
      // ref:"Products",
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
    visible:{
        type:Boolean,
        default:true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reviews", ReviewSchema);
