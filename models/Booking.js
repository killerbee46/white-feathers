import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    futsal: {
      type: mongoose.ObjectId,
      ref: "Futsals",
    },
    payment: {},
    time: {},
    date: {
      type: String
    },
    rate: {
      type: String,
    },
    has7aside: {
      type: Boolean
    },
    booker: {
      type: mongoose.ObjectId,
      ref: "Users",
    },
    name:{},
    contact:{},
    status: {
      type: String,
      default: "Booked",
      enum: ["Booked", "Cancelled"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
