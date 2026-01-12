import { DataTypes } from "sequelize";
import { sequelize } from "../config/tempDb.js";
import User from "./User.js";

const Cart = sequelize.define(
  "cart",
  {
    userId:{
        type: DataTypes.BIGINT,
    },
    products: {
      type: [DataTypes.INTEGER],
      allowNull: false,
    }
  },
  { 
    freezeTableName:true,
    timestamps: false 
  }
);
// Cart.hasOne(User,{
//   foreignKey:'userId',
//   onDelete: 'RESTRICT',
//   onUpdate: 'RESTRICT'
// })
// User.belongsTo(Cart)

export default Cart