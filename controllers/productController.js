import Product from "../models/Product.js";
import productPrice from "../utils/productPrice.js";
import Material from "../models/Material.js";
import Metal from "../models/Metal.js";
import PackageSlider from "../models/PackageSlider.js";
import Wishlist from "../models/Wishlist.js";
import Cart from "../models/Cart.js";
import { sequelize } from "../config/tempDb.js";
import { sqlProductFetch } from "../utils/sqlProductFetch.js";
import { sqlFilterHandler } from "../utils/sqlFilterHandler.js";

//get all products
export const getProductsWQuery = async (req, res) => {
  try {
    let existingWishlist = []
    let existingCart = []
    if (req.user) {

      const userId = req.user.id

      const wishlist = await Wishlist.findOne({ userId: userId })
      const cart = await Cart.findOne({ userId: userId })
      existingWishlist = JSON.parse(wishlist?.products || "[]")?.map((w) => w)
      existingCart = JSON.parse(cart?.products || "[]")?.map((c) => c?.id)
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

export const createProduct = async (req, res) => {
  try {
    const { p_name, p_des, cat_id } =
      req.body;
    //alidation
    switch (true) {
      case !p_name:
        return res.status(400).send({ error: "Name is Required" });
      case !p_des:
        return res.status(400).send({ error: "Description is Required" });
      case !cat_id:
        return res.status(400).send({ error: "Category is Required" });
      // case !quantity:
      //   return res.status(400).send({ error: "Quantity is Required" });
    }

    const products = await Product.create({ ...req.body });

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

//get all products
export const getProducts = async (req, res) => {
  try {
    
    const goldPrice = await Material.findByPk(2, { attributes: ["price"] })
    const silverPrice = await Material.findByPk(3, { attributes: ["price"] })
    const diamondPrice = await Material.findByPk(1, { attributes: ["price", "discount"] })
    const temp = await Product.findAll({
      limit: 100,
      include: [{ model: Metal, required: true }, {
        model: PackageSlider,
        attributes: ['s_path'],
        limit: 1
      }], order: [
        ['id_pack', 'DESC']]
    })

    const products = temp?.map((p) => {
      const productDetails = productPrice({ productData: p?.dataValues, goldPrice: goldPrice?.price, silverPrice: silverPrice?.price, diamondPrice: diamondPrice, details: false })
      return { ...productDetails }
    })

    return res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "All Products ",
      products
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting products",
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

      const userId = req.user.id

      const wishlist = await Wishlist.findOne({ userId: userId })
      const cart = await Cart.findOne({ userId: userId })
      existingWishlist = JSON.parse(wishlist?.products || "[]")?.map((w) => w)
      existingCart = JSON.parse(cart?.products || "[]")?.map((c) => c?.id)
    }

    const goldPrice = await Material.findByPk(2, { attributes: ["price"] })
    const silverPrice = await Material.findByPk(3, { attributes: ["price"] })
    const diamondPrice = await Material.findByPk(1, { attributes: ["price", "discount"] })
    const temp = await Product.findByPk(req?.params?.id, {
      include: [
        { model: Metal, required: true },
        {
          model: PackageSlider,
          attributes: ['s_path'],
          limit: 1
        }
      ]
    })

    const productDetails = productPrice({ productData: temp, goldPrice: goldPrice?.price, silverPrice: silverPrice?.price, diamondPrice: diamondPrice, details: true,wishes:existingWishlist,carts:existingCart })

    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product: productDetails
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getting single product",
      error,
    });
  }
};

//delete 
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByPk(req.params.pid)
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate producta
export const updateProduct = async (req, res) => {
  try {
    const { p_name, p_des, cat_id } =
      req.body;
    //alidation
    switch (true) {
      case !p_name:
        return res.status(400).send({ error: "Name is Required" });
      case !p_des:
        return res.status(400).send({ error: "Description is Required" });
      case !cat_id:
        return res.status(400).send({ error: "Category is Required" });
      // case !quantity:
      //   return res.status(400).send({ error: "Quantity is Required" });
    }

    const product = await Product.findByPk(req.params.id)
    await product.update({ ...req.body }
    );

    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

// get prdocyst by catgory
export const productCategory = async (req, res) => {
  try {
    // const category = await Category.findByPk(req.params.id);
    const goldPrice = await Material.findByPk(2, { attributes: ["price"] })
    const silverPrice = await Material.findByPk(3, { attributes: ["price"] })
    const diamondPrice = await Material.findByPk(1, { attributes: ["price", "discount"] })
    const temp = await Product.findAll({
      where: { cat_id: req?.params?.id },
      include: [{ model: Metal, required: true }, {
        model: PackageSlider,
        attributes: ['s_path'],
        limit: 1
      }], order: [
        ['id_pack', 'DESC']]
    });

    const products = temp?.map((p) => {
      const productDetails = productPrice({ productData: p?.dataValues, goldPrice: goldPrice?.price, silverPrice: silverPrice?.price, diamondPrice: diamondPrice, details: false })
      return { ...productDetails }
    })

    return res.status(200).send({
      success: true,
      products
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};