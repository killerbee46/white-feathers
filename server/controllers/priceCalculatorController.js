import { priceCalculator } from "../utils/priceCalculator.js"

export const calculatePrice = (req, res) => {
 try {
    const materials = req?.body?.materials
  const prices = priceCalculator(materials)

  return res.status(200).json({
    status:'success',
    message:"Price calculated successfully",
    data: prices
  })
 } catch (error) {
    console.log(error)
    return res.status(500).json({
        status:"failed",
        message:"Internal Server Error"
    })
 }
}