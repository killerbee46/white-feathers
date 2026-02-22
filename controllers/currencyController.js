import Currency from "../models/Currency.js";
import { sequelize } from "../config/tempDb.js";

export const createCurrency = async (req, res) => {
  try {
    const { cur_name,cur_rate } =
      req.body;
    //alidation
    switch (true) {
      case !cur_name:
        return res.status(400).send({ error: "Name is Required" });
      case !cur_rate:
        return res.status(400).send({ error: "Rate is Required" });
    }

    const currExists = await Currency.findOne({where:{ cur_name:cur_name }})

    if (currExists) {
      return res?.status(409).json({ error: "Name of currency must be unique" })
    }

    const currency = await Currency.create({ ...req.body });
    
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
    const products = await Currency.findAll({})

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

// get single product
export const getCurrency = async (req, res) => {
  try {
    const currency = await Currency
      .findByPk(req?.params?.id)

    return res.status(200).send({
      status: "success",
      message: "Currency Detail Fetched",
      data:currency,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Error while getting single product",
      error,
    });
  }
};



//delete 
export const deleteCurrency = async (req, res) => {
  try {
    const currency = await Currency.findByPk(req.params.id)
    if (!currency) {
      return res.status(400)?.json({ error: "Currency does not exists" })
    }

    await currency.destroy()

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
    const { cur_name, cur_rate } =
      req.body;
    //alidation

    if (!cur_rate || !cur_name) return res.status(400).send({ error: "Atleast one data is Required" });


    const currency = await Currency.findByPk(req.params.id)
    if (!currency) {
      return res.status(400)?.json({ error: "Currency does not exists" })
    }

    if (currency && req.params.id != currency?.cur_id) {
      return res?.status(409).json({ error: "Currency already exists!" })
    }

    await Currency.findByIdAndUpdate(
      { ...req.body }
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
