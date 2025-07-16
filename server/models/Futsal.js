import mongoose from "mongoose";

const FutsalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    google_map_location_string: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    images: {
      type: [String],
    },
    owner: {
      type: mongoose.ObjectId,
      ref: "Users",
    },
    category:{
      type:[String],
      enum:['5 a side', '7 a side']
    },
    venues:{
      type:Number
    },
    rate:{
      type:Number,
      required:true
    }
    // teamId: {
    //   type: Number,
    //   required: false,
    // },
    // penalty: {
    //   type: Number,
    //   required: false,
    // },
    // role: {
    //   type: Number,
    //   default: 0,
    // },
  },
  { timestamps: true }
);

export default mongoose.model("Futsals", FutsalSchema);
