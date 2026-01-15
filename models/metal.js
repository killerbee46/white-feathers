import { DataTypes } from "sequelize";
import { sequelize } from "../config/tempDb.js";

const Metal = sequelize.define(
  "Metal",
  {
    pmt_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true
    },
    pmt_name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    purity:{
      type: DataTypes.INTEGER
    },
    pm_id:{
      type: DataTypes.INTEGER
    }
  },
  {
    tableName: 'package_metal',
    timestamps: false
  }
)

export default Metal