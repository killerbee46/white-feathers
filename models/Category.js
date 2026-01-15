import { DataTypes } from "sequelize";
import { sequelize } from "../config/tempDb.js";

const Category = sequelize.define(
  "Category",
  {
    cat_id:{
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    cat_name:{
      type: DataTypes.STRING,
      allowNull:false
    },
    cat_pic:{
      type: DataTypes.STRING
    }
  },
  {
    tableName:'package_category',
    timestamps:false
  }
)

export default Category