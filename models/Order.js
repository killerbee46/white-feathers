import { sequelize } from "../config/tempDb.js";
import { DataTypes } from "sequelize";
import CartDetails from "./CartDetails.js";

const Order = sequelize.define(
  "Order",
  {
    cb_id: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    cookie_id:{
      type:DataTypes.STRING
    },
    name:{
      type:DataTypes.STRING
    },
    cno:{
      type:DataTypes.STRING
    },
    email:{
      type:DataTypes.STRING
    },
    msg:{
      type:DataTypes.STRING
    },
    address:{
      type:DataTypes.STRING
    },
    book_date:{
      type:DataTypes.DATE
    },
    p_date:{
      type:DataTypes.DATEONLY
    },
    ip:{
      type:DataTypes.INTEGER
    },
    mode:{
      type:DataTypes.INTEGER
    },
    p_id:{
      type:DataTypes.INTEGER
    },
    dispatch:{
      type:DataTypes.INTEGER
    },
    deliver:{
      type:DataTypes.INTEGER
    },
    checkout:{
      type:DataTypes.INTEGER
    },
    c_id:{
      type:DataTypes.INTEGER
    },
    p_amount:{
      type:DataTypes.INTEGER
    },
    cur_id:{
      type:DataTypes.INTEGER
    },
    c_request:{
      type:DataTypes.INTEGER
    },
    esewa_code:{
      type:DataTypes.INTEGER
    },
    esewa_verify:{
      type:DataTypes.INTEGER
    },
    khalti_code:{
      type:DataTypes.INTEGER
    },
    tracking_code:{
      type:DataTypes.BIGINT
    }
  },
  { 
    timestamps: false,
    tableName:"cart_book" 
  }
);

Order.hasMany(CartDetails, {
  foreignKey: 'cb_id'
});

export default Order;