import { DataTypes } from "sequelize";
import { sequelize } from "../config/tempDb.js";
import User from "./User.js";

const Notification = sequelize.define(
    "Notification",
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        to: {
            type: DataTypes.STRING,
            enum: ["user", "employee", "both"],
            defaultValue: "user"
        },
        opened: {
            type: DataTypes.TEXT,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "c_id"
            }
        },
    },
    {
        timestamps: false
    }
);

Notification.hasOne(User, {
  foreignKey: "c_id",
  sourceKey: "createdBy"
})

export default Notification
