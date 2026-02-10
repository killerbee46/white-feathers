import { sequelize } from "../config/tempDb.js";
import { DataTypes } from "sequelize";
import User from "./User.js";

const Review = sequelize.define(
  "Review",
  {
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "c_id"
      }
    },
    productId: {
      type: DataTypes.INTEGER
    },
    type: {
      type: String,
      enum: ['product', 'testimonial'],
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false
    },
    visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'testimonials'
  }
);

Review.hasOne(User, {
  foreignKey: "c_id",
  sourceKey: "userId"
})

export default Review
