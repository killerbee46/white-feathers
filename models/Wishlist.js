import { DataTypes } from "sequelize";
import { sequelize } from "../config/tempDb.js";

const Wishlist = sequelize.define(
  "Wishlist",
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

export default Wishlist