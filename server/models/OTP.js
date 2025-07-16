import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otp_expiry: {
      type: Date,
      required: true,
    },
    data:{
        type:Object,
    }
  },
  { timestamps: true }
);

export default mongoose.model("OTP", OTPSchema);
