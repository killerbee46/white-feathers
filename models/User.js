import { DataTypes } from "sequelize";
import { sequelize } from "../config/tempDb.js";
import dayjs from "dayjs";

const User = sequelize.define(
  "User",
  {
    c_id:{
        type: DataTypes.BIGINT,
        primaryKey:true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique:true
    },
    pass: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      required: true,
      unique:true
    },
    address: {
      type: DataTypes.STRING,
      required: true,
    },
    join_date: {
      type: DataTypes.DATEONLY,
      defaultValue: dayjs().format("YYYY-MM-DD")
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    otp: {
      type: DataTypes.STRING
    },
  },
  { 
    tableName:"customer",
    timestamps: false 
  }
);

export default User