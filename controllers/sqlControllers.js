import { sequelize } from "../config/tempDb.js";
import Cart from "../models/Cart.js";
import userModel from "../models/userModel.js";
import Wishlist from "../models/Wishlist.js";
import { sqlFilterHandler } from "../utils/sqlFilterHandler.js";
import { sqlProductFetch } from "../utils/sqlProductFetch.js";
import dayjs from "dayjs"

//get all products
export const getProducts = async (req, res) => {
  try {
    let existingWishlist = []
    let existingCart = []
    if (req.user) {

      const userId = req.user._id

      const wishlist = await Wishlist.findOne({ userId: userId }, "products")
      const cart = await Cart.findOne({ userId: userId }, "products")
      existingWishlist = wishlist ? wishlist?.products?.map((w) => w?.id) : []
      existingCart = cart ? cart?.products?.map((c) => c?.id) : []
    }
    const wishListCheck = existingWishlist.length !== 0 ? ` IF(p.id_pack in (${existingWishlist?.join(",")}), true, false) as wishlist, ` : ""
    const cartCheck = existingCart.length !== 0 ? ` IF(p.id_pack in (${existingCart?.join(",")}), true, false) as cart, ` : ""

    const categories = req?.query?.category
    const categoryFilter = (categories && categories.length !== 0) ? " and cat_id = " + categories.join(" or cat_id = ") : ""
    const query = sqlProductFetch("p.p_name as title," + wishListCheck + cartCheck) + categoryFilter + sqlFilterHandler(req?.query)
    const [data] = await sequelize.query(query)

    res.status(200).json({
      status: 'success',
      data: data,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: "Erorr while getting products",
      error: error.message,
    });
  }
};
// get single product
export const getProduct = async (req, res) => {
  try {
    let existingWishlist = []
    let existingCart = []
    if (req.user) {

      const userId = req.user._id

      const wishlist = await Wishlist.findOne({ userId: userId }, "products")
      const cart = await Cart.findOne({ userId: userId }, "products")
      existingWishlist = wishlist?.products?.map((w) => w?.id) || []
      existingCart = cart?.products?.map((c) => c?.id) || []
    }
    const wishListCheck = existingWishlist?.length !== 0 ? ` IF(p.id_pack in (${existingWishlist?.join(",")}), true, false) as wishlist, ` : ""
    const cartCheck = existingCart?.length !== 0 ? ` IF(p.id_pack in (${existingCart?.join(",")}), true, false) as cart, ` : ""
    const query = sqlProductFetch(`p.*,` + wishListCheck + cartCheck) + ` and p.id_pack = ${req?.params?.id}`
    const [data] = await sequelize.query(query)

    res.status(200).json({
      status: 'success',
      message: "Product detail fetched successfully",
      data: data[0]
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const query = "Select * from package_category where 1 " + sqlFilterHandler(req?.query)
    const [data] = await sequelize.query(query)

    return res.status(200).json({
      status: 'success',
      message: "Categories fetched successfully",
      data: data
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: "Erorr while getting products",
      error: error.message,
    });
  }
};

export const createOrder = async (req, res) => {
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
      products: products,
      totalPrice: (finalPrice + totalDiscount).toFixed(),
      totalDiscount: (totalDiscount).toFixed(),
      finalPrice: (finalPrice).toFixed(),
    })

    const orderQuery = `INSERT INTO cart_book (cookie_id, name, cno, email, address,tracking_code, cur_id, checkout) VALUES (
    '${orderDetails}','${user?.name}','${user?.phone}','${user?.email}','${user?.address}','${dayjs().unix()}',1,1
    );`
    const [orderCreate] = await sequelize.query(orderQuery)

    return res.status(201).json({
      status: 'success',
      message: "Order Created Successfully",
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: "Erorr while creating order",
      error: error.message,
    });
  }
};

export const getOrdersByUser = async (req, res, next) => {
  try {
    const userId = req?.user?._id
    const user = await userModel.findById(userId, 'phone')

    const orderQuery = `SELECT cookie_id as order_details,name, cno as phone, email, address,tracking_code, esewa_code, p_amount, p_date  from cart_book
    where length(cookie_id)>10 and cno = ${user?.phone} and checkout = 1
    ;`
    const [orders] = await sequelize.query(orderQuery)

    const orderData = orders?.map((ord) => {
      const orderDetail = JSON.parse(ord?.order_details)
      const esewa_code = ord?.esewa_code
      const transaction_mode = ord?.esewa_code && ord?.esewa_code !== "" ? "esewa" : "cod"
      delete ord?.order_details
      delete ord?.esewa_code
      return {
        ...ord,
        ...orderDetail,
        transaction_mode: transaction_mode,
        transaction_code: esewa_code
      }
    })

    return res.status(200).json({
      status: 'success',
      message: "Order Fetched Successfully",
      data: orderData
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 'failed',
      message: "Erorr while getting orders",
      error: error.message,
    });
  }
}

export const getOrders = async (req, res, next) => {
  try {
    const userId = req?.user?._id
    const user = await userModel.findById(userId, 'phone')

    const orderQuery = `SELECT cookie_id as order_details,name, cno as phone, email, address,tracking_code, esewa_code, p_amount, p_date  from cart_book
    where length(cookie_id)>10 and checkout = 1
    ;`
    const [orders] = await sequelize.query(orderQuery)

    const orderData = orders?.map((ord) => {
      const orderDetail = JSON.parse(ord?.order_details)
      const esewa_code = ord?.esewa_code
      const transaction_mode = ord?.esewa_code && ord?.esewa_code !== "" ? "esewa" : "cod"
      delete ord?.order_details
      delete ord?.esewa_code
      return {
        ...ord,
        ...orderDetail,
        transaction_mode: transaction_mode,
        transaction_code: esewa_code
      }
    })

    return res.status(200).json({
      status: 'success',
      message: "Order Fetched Successfully",
      data: orderData
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 'failed',
      message: "Erorr while getting orders",
      error: error.message,
    });
  }
}

export const getOrderDetails = async (req, res, next) => {
  try {
    const { trackingCode } = req?.params
    const userId = req?.user?._id
    const user = await userModel.findById(userId, 'phone role')

    const orderQuery = `SELECT cookie_id as order_details,name, cno as phone, email, address,tracking_code, esewa_code, p_amount, p_date  from cart_book
    where length(cookie_id)>10 and checkout = 1 and tracking_code = ${trackingCode}
    ;`
    const [orders] = await sequelize.query(orderQuery)
    const order = orders[0]

    if (!(user?.phone === order?.phone || user?.role === 3)) {
      return res.status(401).json({
        status: 'failed',
        message: "Not authorized to view order"
      })
    }

    const orderData = () => {
      const orderDetail = JSON.parse(order?.order_details)
      const esewa_code = order?.esewa_code
      const transaction_mode = order?.esewa_code && order?.esewa_code !== "" ? "esewa" : "cod"
      delete order?.order_details
      delete order?.esewa_code
      return {
        ...order,
        ...orderDetail,
        transaction_mode: transaction_mode,
        transaction_code: esewa_code
      }
    }

    return res.status(200).json({
      status: 'success',
      message: "Order Fetched Successfully",
      data: orderData()
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 'failed',
      message: "Erorr while getting orders",
      error: error.message,
    });
  }
}

export const getMaterials = async (req, res, next) => {
  try {
    const materialsQuery = `SELECT * from package_material`
    const [materials] = await sequelize.query(materialsQuery)

    return res.status(200).json({
      status: 'success',
      message: "Materials Fetched Successfully",
      data: materials
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 'failed',
      message: "Erorr while getting materials",
      error: error.message,
    });
  }
}

export const getMetals = async (req, res, next) => {
  try {
    const metalsQuery = `SELECT pm.pm_id, pm.pmt_name,round((pm.purity/100 * pmt.price),2) as price FROM package_metal pm 
inner join package_material pmt where pmt.pm_id = pm.pm_id`
    const [metals] = await sequelize.query(metalsQuery)

    return res.status(200).json({
      status: 'success',
      message: "Metals Fetched Successfully",
      data: metals
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 'failed',
      message: "Erorr while getting metals",
      error: error.message,
    });
  }
}

export const getMetalsByMaterial = async (req, res, next) => {
  try {
    const { materialId } = req?.params

    const materialsQuery = `SELECT pm.pmt_id, pm.pmt_name,round((pm.purity/100 * pmt.price),2) as price FROM package_metal pm
inner join package_material pmt where pmt.pm_id = pm.pm_id
and pm.pm_id = ${materialId} `
    const [materials] = await sequelize.query(materialsQuery)

    return res.status(200).json({
      status: 'success',
      message: "Metals Fetched Successfully",
      data: materials
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 'failed',
      message: "Erorr while getting metals",
      error: error.message,
    });
  }
}