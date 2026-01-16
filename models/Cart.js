import { DataTypes } from "sequelize";
import { sequelize } from "../config/tempDb.js";

const Cart = sequelize.define(
  "Cart",
  {
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    userId:{
      type: DataTypes.INTEGER,
    },
    products: {
      type: DataTypes.STRING
    }
  },
  { 
    timestamps: false 
  }
);

export default Cart