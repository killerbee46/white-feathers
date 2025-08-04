import dayjs from "dayjs";
import Payment from "../models/Payment.js";
import userModel from "../models/userModel.js";
import { getEsewaPaymentHash, verifyEsewaPayment } from "../utils/esewa.js";
import { sequelize } from "../config/tempDb.js";

export const initializeEsewaPayment = async (req, res) => {
  try {
const { products, productId } = req?.body
    const userId = req?.user?._id
    const user = await userModel.findById(userId, 'name email phone address')
    if ((!products || products?.length === 0) && productId) {
      const query = sqlProductFetch("p.p_name as title,") + ` and p.id_pack = ${productId} `
      const [data] = await sequelize.query(query)
      req.body.products.push({ ...data[0], quantity: 1 })
    }
    let finalPrice = 0
    let totalDiscount = 0
    products?.map((p) => {
      const price = p?.dynamic_price * p?.quantity
      const discount = p?.discount * p?.quantity
      finalPrice += price
      totalDiscount += discount
    })

    const orderDetails = JSON.stringify({
      products:products,
      totalPrice:(finalPrice+totalDiscount).toFixed(),
      totalDiscount:(totalDiscount).toFixed(),
      finalPrice:(finalPrice).toFixed(),
    })

    const orderQuery = `INSERT INTO cart_book (cookie_id, name, cno, email, address,tracking_code, cur_id) VALUES (
    '${orderDetails}','${user?.name}','${user?.phone}','${user?.email}','${user?.address}','${dayjs().unix()}',1
    );`

    let tId = ''

    const [orderCreate] = await sequelize.query(orderQuery)
    tId = await sequelize.query(`Select tracking_code from cart_book where cb_id = ${orderCreate}`).then((data)=>{
        return data[0]?.[0]?.tracking_code
    })

    // Initiate payment with eSewa
    const paymentInitiate = await getEsewaPaymentHash({
      amount: (finalPrice).toFixed(2),
      transaction_uuid: tId,
    });

    // Respond with payment details
    return res.json({
      success: true,
      payment: paymentInitiate,
      id:tId,
      amount:(finalPrice).toFixed()
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
    const orderQuery = `UPDATE cart_book
SET checkout = 1, esewa_code = '${paymentInfo.decodedData.transaction_code}',esewa_verify=1, p_date = ${dayjs().format("YYYY-MM-DD")},
p_amount = ${paymentInfo.decodedData.total_amount}
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
SET checkout = 1, esewa_code = '${paymentInfo.decodedData.transaction_code}',esewa_verify=1, p_date = ${dayjs().format("YYYY-MM-DD")},
p_amount = ${paymentInfo.decodedData.total_amount}
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