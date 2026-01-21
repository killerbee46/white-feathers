import { DataTypes } from "sequelize";
import { sequelize } from "../config/tempDb.js";
import Product from "./Product.js";
import PackageSlider from "./PackageSlider.js";

const CartDetails = sequelize.define(
    "CartDetails",
    {
        cart_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        cb_id: {
            type: DataTypes.INTEGER,
        },
        id_pack: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: "id_pack"
            }
        },
        qty: {
            type: DataTypes.INTEGER
        },
        rate: {
            type: DataTypes.INTEGER
        },
        discount: {
            type: DataTypes.INTEGER
        },
        size: {
            type: DataTypes.INTEGER
        }
    },
    {
        tableName: 'cart_detail',
        timestamps: false
    }
)

CartDetails.associate = (models) => {
    CartDetails.belongsTo(models.Order, {
        foreignKey: 'cb_id',
        as: 'products'
    });
};

CartDetails.hasOne(Product, {
    foreignKey: "id_pack",
    sourceKey: "id_pack"
})

export default CartDetails