import { DataTypes } from "sequelize";
import { sequelize } from "../config/tempDb.js";
import User from "./User.js";

const Cart = sequelize.define(
  "cart",
  {
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
Cart.hasOne(User,{
  foreignKey:'c_id',
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
  as:"userId"
})
// User.belongsTo(Cart)

export default Cart