import { DataTypes } from "sequelize";
import { sequelize } from "../config/tempDb.js";

const Payment = sequelize.define(
    "Payment",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        transactionId: {
            type: DataTypes.STRING,
            unique: true
        },
        orderId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: { type: DataTypes.INTEGER, allowNull: false },
        paymentGateway: {
            type: DataTypes.STRING,
            enum: ["khalti", "esewa", "cod"],
        },
        status: {
            type: DataTypes.STRING,
            enum: ["success", "pending", "failed"],
            defaultValue: "pending"
        },
        paymentDate: {
            type: DataTypes.DATEONLY, defaultValue: Date.now()
        },
    },
    { timestamps: false }
);
export default Payment