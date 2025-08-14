import { sequelize } from "../config/tempDb.js";
import Product from "../models/Product.js";
import { priceCalculator } from "../utils/priceCalculator.js"

export const calculatePrice = async (req, res) => {
  try {
    const product = await Product
      .find({}).populate('materials.materialid', "unitPrice discount").populate('materials.metalid', "unitPrice");

    const materials = product?.materials
    const prices = priceCalculator(materials)

    return res.status(200).json({
      status: 'success',
      message: "Price calculated successfully",   
      data: materials
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error"
    })
  }
}

export const sqlCalculatePrice = async (req, res) => {
  try {

    const materials = req?.body?.materials
    const array = []

  for (const material of materials) {
    const { materialId, metalId, price = 0, weight, unit, makingCharge, makingUnit } = material;

    // Base query to get material
    const [materialRows] = await sequelize.query(
        `SELECT pmt.pm_id as id, pmt.discount, pmt.price as unitPrice from package_material pmt where pmt.pm_id = ${material?.materialId}`
      );

    let materialData = materialRows[0] || {};
    materialData.unitPrice = material?.metalId ? materialData?.unitPrice : material?.price
    let metalData = null

    // If metalId exists, fetch related metal
    if (metalId) {
      const [metalRows] = await sequelize.query(
        `SELECT pm.pmt_id as id ,round((pm.purity/100 * pmt.price),2) as unitPrice FROM package_metal pm inner join package_material pmt where pmt.pm_id = pm.pm_id and pm.pm_id = ${material?.materialId} and pm.pmt_id = ${material?.metalId}`
      );
      metalData = metalRows[0] || {};
    }

    // Add other custom fields
    materialData = {
      materialId:materialData,
      metalId:metalData,
      weight,
      unit,
      makingCharge,
      makingUnit
    };

    array.push(materialData);
  }

    const prices = priceCalculator(array)
    return res.status(200).json({
      status: 'success',
      message: "Price calculated successfully",
      data: prices
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error"
    })
  }
}