import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        transactionId: { type: String, unique: true },
        pidx: { type: String, unique: true },
        orderId: {
            type: String,
            required: true,
        },
        amount: { type: Number, required: true },
        dataFromVerificationReq: { type: Object },
        apiQueryFromUser: { type: Object },
        paymentGateway: {
            type: String,
            enum: ["khalti", "esewa", "cod"],
            required: true,
        },
        status: {
            type: String,
            enum: ["success", "pending", "failed"],
            default: "pending",
        },
        paymentDate: { type: Date, default: Date.now },
    },
    { timestamps: true }
);
export default mongoose.model("payment", paymentSchema);