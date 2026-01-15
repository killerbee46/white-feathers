import { DataTypes } from "sequelize";
import { sequelize } from "../config/tempDb.js";
import Metal from "./Metal.js";
import PackageSlider from "./PackageSlider.js";

const Product = sequelize.define(
  "Product",
  {
    id_pack: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    p_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    p_des: {
      type: DataTypes.STRING,
      allowNull: false
    },
    p_text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isFixedPrice: {
      type: DataTypes.STRING,
    },
    fixed_price: {
      type: DataTypes.INTEGER
    },
    pm_id: {
      type: DataTypes.INTEGER
    },
    pmt_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Metal,
        key: "pmt_id"
      }
    },
    cat_id: {
      type: DataTypes.INTEGER
    },
    ps_id: {
      type: DataTypes.INTEGER
    },
    tag_kid: {
      type: DataTypes.INTEGER
    },
    tag_men: {
      type: DataTypes.INTEGER
    },
    tag_women: {
      type: DataTypes.INTEGER
    },
    tag_gift: {
      type: DataTypes.INTEGER
    },
    offer: {
      type: DataTypes.INTEGER
    },
    offer_b2b: {
      type: DataTypes.INTEGER
    },
    weight: {
      type: DataTypes.INTEGER
    },
    dc_rate: {
      type: DataTypes.INTEGER
    },
    dc_qty: {
      type: DataTypes.INTEGER
    },
    dc_rate_bce2: {
      type: DataTypes.INTEGER
    },
    dc_qty_bce2: {
      type: DataTypes.INTEGER
    },
    mk_pp: {
      type: DataTypes.INTEGER
    },
    mk_gm: {
      type: DataTypes.INTEGER
    },
    jarti: {
      type: DataTypes.INTEGER
    },
    dc_rate_b2b: {
      type: DataTypes.INTEGER
    },
    dc_qty_b2b: {
      type: DataTypes.INTEGER
    },
    dc_rate_b2b_b2e2: {
      type: DataTypes.INTEGER
    },
    dc_qty_b2b_b2e2: {
      type: DataTypes.INTEGER
    },
    mk_pp_b2b: {
      type: DataTypes.INTEGER
    },
    mk_gm_b2b: {
      type: DataTypes.INTEGER
    },
    jarti_b2b: {
      type: DataTypes.INTEGER
    }
  },
  {
    tableName: 'package',
    timestamps: false
  }
)

Product.hasOne(Metal, {
  foreignKey: "pmt_id",
  sourceKey: "pmt_id"
})
Product.hasMany(PackageSlider, {
  foreignKey: 'id_pack'
});


export default Product