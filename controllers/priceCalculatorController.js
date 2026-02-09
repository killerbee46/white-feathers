import { sequelize } from "../config/tempDb.js";
import Material from "../models/Material.js";
import Metal from "../models/Metal.js";
import { priceCalculator } from "../utils/priceCalculator.js"

export const calculatePrice = async (req, res) => {
  try {
    const { materials: tempMat } = req?.body

    const materialIds = tempMat?.map((mat) => mat?.materialId)
    const metalIds = tempMat?.map((met) => met?.metalId)

    const materials = await Material.findAll({ where: { pm_id: materialIds } })
    const metals = await Metal.findAll({ where: { pmt_id: metalIds } })

    const dataToOperate = tempMat?.map((dat) => ({
      materialId:dat?.materialId,
      metalId:dat?.metalId,
      material: materials?.find((mat) => mat?.pm_id == dat?.materialId),
      metal: metals?.find((met) => met?.pmt_id == dat?.metalId),
      price: dat?.price,
      weight: dat?.weight,
      mk_pp: dat?.mk_pp,
      mk_gm: dat?.mk_gm,
      jarti: dat?.jarti,
    }))

    const prices = priceCalculator(dataToOperate)

    return res.status(200).json({
      status: 'success',
      message: "Price calculated successfully",
      data: dataToOperate
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
        materialId: materialData,
        metalId: metalData,
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