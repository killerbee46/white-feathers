import { DataTypes } from "sequelize";
import {sequelize} from "../config/tempDb.js"

const Currency = sequelize.define(
"Currency",
  {
    cur_id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    cur_name: {
      type: DataTypes.STRING
    },
    cur_rate: {
      type: DataTypes.INTEGER
    },
    last_updated_at: {
      type: DataTypes.STRING,
    },
  },
  { 
    timestamps: false,
  tableName:'currency'
  }
);

export default Currency;
