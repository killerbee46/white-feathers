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

    materials?.map(async(mat)=> {
      const metalsQuery = `Select * from package_metal where pm_`
    const [metals] = await sequelize.query(productsQuery)
    array.push(metals[0])
    })

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