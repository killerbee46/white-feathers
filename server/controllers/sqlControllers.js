import { sequelize } from "../config/tempDb.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import { sqlFilterHandler } from "../utils/sqlFilterHandler.js";
import { sqlProductFetch } from "../utils/sqlProductFetch.js";

//get all products
export const getProducts = async (req, res) => {
  try {
    let existingWishlist = []
    let existingCart = []
    if (req.user) {
      
      const userId = req.user._id
  
      const wishlist = await Wishlist.findOne({userId:userId},"products")
      const cart = await Cart.findOne({userId:userId},"products")
      existingWishlist = wishlist?.products?.map((w)=> w?.id_pack)
      existingCart = cart?.products?.map((c)=> c?.id_pack)
    }
    const wishListCheck = existingWishlist.length !== 0 ? ` IF(p.id_pack in (${ existingWishlist?.join(",")}), true, false) as wishlist, ` : ""
    const cartCheck = existingCart.length !== 0 ? ` IF(p.id_pack in (${ existingCart?.join(",")}), true, false) as cart, ` : ""

    const categories = req?.query?.category
    const categoryFilter = (categories && categories.length !== 0) ? " and cat_id = " + categories.join(" or cat_id = ") : ""
    const query = sqlProductFetch("p.p_name as title,"+wishListCheck+cartCheck) + categoryFilter + sqlFilterHandler(req?.query)
    const [data] = await sequelize.query(query)

    res.status(200).json({
      status: 'success',
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
// get single product
export const getProduct = async (req, res) => {
  try {
    let existingWishlist = []
    let existingCart = []
    if (req.user) {
      
      const userId = req.user._id
  
      const wishlist = await Wishlist.findOne({userId:userId},"products")
      const cart = await Cart.findOne({userId:userId},"products")
      existingWishlist = wishlist?.products?.map((w)=> w?.id_pack)
      existingCart = cart?.products?.map((c)=> c?.id_pack)
    }
    const wishListCheck = existingWishlist.length !== 0 ? ` IF(p.id_pack in (${ existingWishlist?.join(",")}), true, false) as wishlist, ` : ""
    const cartCheck = existingCart.length !== 0 ? ` IF(p.id_pack in (${ existingCart?.join(",")}), true, false) as cart, ` : ""
    const query = sqlProductFetch(`p.*,`+wishListCheck+cartCheck) + ` and p.id_pack = ${req?.params?.id}`
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
    const { } = req?.body
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