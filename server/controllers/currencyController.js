import dayjs from "dayjs";
import Currency from "../models/Currency.js";
import axios from "axios";
import { sequelize } from "../config/tempDb.js";

export const createCurrency = async (req, res) => {
  try {
    const { name, slug, rate } =
      req.body;
    //alidation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is Required" });
      case !slug:
        return res.status(400).send({ error: "Slug is Required" });
      case !rate:
        return res.status(400).send({ error: "Rate is Required" });
    }

    const currExists = await Currency.findOne({ slug })

    if (currExists) {
      return res?.status(409).json({ error: "Slug of currency must be unique" })
    }

    const currency = new Currency({ ...req.body });
    await currency.save();
    res.status(201).send({
      status: "success",
      message: "Currency added Successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      error,
      message: "Error in creating currency",
    });
  }
};

//get all products
export const getCurrencies = async (req, res) => {
  try {
    const products = await Currency.find({})
    const metalsApi = "https://api.metalpriceapi.com/v1/latest?api_key=4e8fddec48803e9b96414a1d27450d14&base=NPR&currencies=EUR,AUD,USD,CAD,XAU,XAG"

    return res.status(200).send({
      status: "success",
      message: "All Currencies ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Erorr in getting currencies",
      error: error.message,
    });
  }
};
export const getCurrenciesSql = async (req, res) => {
  try {
    const currencyQuery = "select * from currency"
    const [currency] = await sequelize.query(currencyQuery)

    return res.status(200).send({
      status: "success",
      message: "All Currencies ",
      currency,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Erorr in getting currencies",
      error: error.message,
    });
  }
};
// get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product
      .findById(req?.params?.id)
    res.status(200).send({
      status: "success",
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Eror while getitng single product",
      error,
    });
  }
};



//delete 
export const deleteCurrency = async (req, res) => {
  try {
    const deleted = await Currency.findByIdAndDelete(req.params.id).select("-photo");
    if (!deleted) {
      return res.status(400)?.json({ error: "Currency does not exists" })
    }
    return res.status(200).send({
      status: "success",
      message: "Currency Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Error while deleting Currency",
      error,
    });
  }
};

//upate producta
export const updateCurrency = async (req, res) => {
  try {
    const { name, slug, rate } =
      req.body;
    //alidation

    if (!rate || !slug || !name) return res.status(400).send({ error: "Atleast one data is Required" });


    const currExists = await Currency.findOne({ slug }, "")

    if (currExists && req.params.id != currExists?._id) {
      return res?.status(409).json({ error: "Slug of currency must be unique" })
    }

    const currency = await Currency.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    await currency.save();
    return res.status(201).send({
      status: "success",
      message: "Currency Updated Successfully",
      currency,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      error,
      message: "Error in Update Currency",
    });
  }
};
