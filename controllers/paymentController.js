import dayjs from "dayjs";
import Payment from "../models/Payment.js";
import { getEsewaPaymentHash, verifyEsewaPayment } from "../utils/esewa.js";
import { sequelize } from "../config/tempDb.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Material from "../models/Material.js";
import Product from "../models/Product.js";
import Metal from "../models/Metal.js";
import PackageSlider from "../models/PackageSlider.js";
import productPrice from "../utils/productPrice.js";

export const initializeEsewaPayment = async (req, res) => {
  try {

    const userId = req?.user?.id
    const user = await User.findByPk(userId, { attributes: ['name', 'address', 'phone', "email"] })
    const { products: temp, name, address, msg } = req?.body
    const ids = temp?.map((t) => t?.id)

    const goldPrice = await Material.findByPk(2, { attributes: ["price"] })
    const silverPrice = await Material.findByPk(3, { attributes: ["price"] })
    const diamondPrice = await Material.findByPk(1, { attributes: ["price", "discount"] })
    const allProducts = await Product.findAll({
      where: { id_pack: ids },
      include: [{ model: Metal, required: true }, {
        model: PackageSlider,
        attributes: ['s_path'],
        limit: 1
      }]
    })

    const products = temp?.map((t) => {
      const product = allProducts.find((f) => f?.id_pack === t?.id)
      const productDetail = productPrice({ productData: product?.dataValues, goldPrice: goldPrice?.price, silverPrice: silverPrice?.price, diamondPrice: diamondPrice, details: false })
      return { ...productDetail, quantity: t?.quantity }
    })

    let totalPrice = 0
    let totalDiscount = 0
    let totalFinalPrice = 0

    products?.map((p) => {
      totalPrice += (p?.dynamicPrice * p?.quantity)
      totalDiscount += (p?.discount * p?.quantity)
      totalFinalPrice += (p?.finalPrice * p?.quantity)
    })

    const createdOrder = await Order.create({
      name: name ?? user?.name,
      cno: user?.phone,
      email: user?.email,
      address: address ?? user?.address,
      msg: msg,
      cookie_id: JSON.stringify({ products: products }),
      checkout: 0,
      mode: 0,
      tracking_code: dayjs().unix(),
      cur_id: 1,
      dispatch: 0,
      deliver: 0,
      c_id: userId,
      p_date: dayjs().format("YYYY-MM-DD")
    })

    const tId = createdOrder?.tracking_code

    // Initiate payment with eSewa
    const paymentInitiate = await getEsewaPaymentHash({
      amount: totalFinalPrice,
      transaction_uuid: tId,
    });

    // Respond with payment details
    return res.json({
      success: true,
      payment: paymentInitiate,
      id: tId,
      amount: totalFinalPrice
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const completeEsewaPayment = async (req, res) => {
  const { data } = req.query; // Data received from eSewa's redirect

  try {
    // Verify payment with eSewa
    const paymentInfo = await verifyEsewaPayment(data);

    // Find the purchased item using the transaction UUID
    const order = await Order.findOne({where:{tracking_code:paymentInfo.decodedData.transaction_uuid}})

    await order.update({
      checkout:1,
      mode:3,
      esewa_code:paymentInfo.decodedData.transaction_code,
      esewa_verify:1,
      p_date:dayjs().format("YYYY-MM-DD"),
      p_amount:paymentInfo.decodedData.total_amount
    })
    
    // Create a new payment record in the database
    await Payment.create({
      transactionId: paymentInfo.decodedData.transaction_code,
      orderId: paymentInfo.response.transaction_uuid,
      amount: paymentInfo.decodedData.total_amount,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: "esewa",
      status: "success",
    });


    // Respond with success message
    return res.json({
      success: true,
      message: "Payment successful! Order placed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during payment verification",
      error: error.message,
    });
  }
}

export const failedEsewaPayment = async (req, res) => {
  const { data } = req.query; // Data received from eSewa's redirect

  try {
    // Verify payment with eSewa
    const paymentInfo = await verifyEsewaPayment(data);

    // Find the purchased item using the transaction UUID
    const orderQuery = `delete from cart_book
WHERE tracking_code = ${paymentInfo.decodedData.transaction_uuid}`
    const [orderData] = await sequelize.query(orderQuery)
    // PurchasedItem.findById(
    //   paymentInfo.response.transaction_uuid
    // );


    // Create a new payment record in the database
    const paymentData = await Payment.create({
      pidx: paymentInfo.decodedData.transaction_code,
      transactionId: paymentInfo.decodedData.transaction_code,
      orderId: paymentInfo.response.transaction_uuid,
      amount: paymentInfo.decodedData.total_amount,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: "esewa",
      status: "failed",
    });


    // Respond with success message
    return res.json({
      success: true,
      message: "Payment successful! Order placed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during payment verification",
      error: error.message,
    });
  }
}