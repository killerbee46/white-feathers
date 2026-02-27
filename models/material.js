import { DataTypes } from "sequelize";
import { sequelize } from "../config/tempDb.js";

const Material = sequelize.define(
  "Material",
  {
    pm_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true
    },
    pm_name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    price:{
      type: DataTypes.BIGINT
    },
    lux_tax:{
      type: DataTypes.INTEGER
    },
    discount:{
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'package_material',
    timestamps: false
  }
  
)

export default Material