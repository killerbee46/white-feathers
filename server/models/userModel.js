import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: {},
      required: true,
    },
    teamId: {
      type: Number,
      required: false,
    },
    penalty: {
      type: Number,
      required: false,
    },
    image:{
      type:String
    },
    role: {
      type: Number,
      default: 0,
    },
    otp: {
      type: String
    },
  },
  { timestamps: true }
);

export default mongoose.model("Users", userSchema);
