import { DataTypes } from "sequelize";
import { sequelize } from "../config/tempDb.js";

const PackageSlider = sequelize.define(
    "Images",
    {
        s_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        id_pack: {
            type: DataTypes.INTEGER,
        },
        s_path: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: 'package_slider',
        timestamps: false
    }
)

PackageSlider.associate = (models) => {
    PackageSlider.belongsTo(models.Product, {
        foreignKey: 'id_pack',
        as: 'product'
    });
};

export default PackageSlider