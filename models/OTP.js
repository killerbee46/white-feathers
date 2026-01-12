import { DataTypes } from "sequelize";
import { sequelize } from "../config/tempDb.js";

const OTP = sequelize.define(
  "OTP",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    otp_expiry: {
      type: DataTypes.DATE,
      allowNull:false
    }
  },
  { timestamps: false }
);

export default OTP