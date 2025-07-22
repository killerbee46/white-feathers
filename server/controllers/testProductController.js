import Product from "../models/Product.js";

export const testCreateProduct = async (req, res) => {
  try {
    const { name, materials } = req.body;
    //alidation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is Required" });
      case (!materials || materials.length === 0):
        return res.status(400).send({ error: "Materials is Required" });
    }

    const products = new Product({ ...req.body });
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
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
export const testGetProducts = async (req, res) => {
  try {
    const products = await Product
      .find({})
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "All Products ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};
// get single product
export const testGetProduct = async (req, res) => {
  try {
    const product = await Product
      .findById(req?.params?.id)
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};
