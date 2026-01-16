import Product from "../models/Product.js";
import productPrice from "../utils/productPrice.js";
import Material from "../models/Material.js";
import Metal from "../models/Metal.js";
import PackageSlider from "../models/PackageSlider.js";

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
    const goldPrice = await Material.findByPk(2, { attributes: ["price"] })
    const silverPrice = await Material.findByPk(3, { attributes: ["price"] })
    const diamondPrice = await Material.findByPk(1, { attributes: ["price", "discount"] })
    const temp = await Product.findByPk(req?.params?.id, {
      include: [{ model: Metal, required: true }, {
        model: PackageSlider,
        attributes: ['s_path'],
        limit: 1
      }]
    })

    const productDetails = productPrice({ productData: temp, goldPrice: goldPrice?.price, silverPrice: silverPrice?.price, diamondPrice: diamondPrice, details: true })

    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product: temp
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