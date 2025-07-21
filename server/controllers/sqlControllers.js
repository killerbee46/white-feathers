import { sequelize } from "../config/tempDb.js";
import { sqlFilterHandler } from "../utils/sqlFilterHandler.js";
import { sqlProductFetch } from "../utils/sqlProductFetch.js";

//get all products
export const getProducts = async (req, res) => {
  try {
    const categories = req?.query?.category
    const categoryFilter = categories && categories.length !== 0 && " and cat_id = "+categories.join(" or cat_id = ")
    const query = sqlProductFetch("p.p_name as title")+categoryFilter+sqlFilterHandler(req?.query)
    const [data] = await sequelize.query(query)

    res.status(200).json({
        status:'success',
        data:data
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
    const query = sqlProductFetch("p.*")+` and p.id_pack = ${req?.params?.id}`
    const [data] = await sequelize.query(query)

    res.status(200).json({
        status:'success',
        message:"Product detail fetched successfully",
        data:data[0]
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
    const query = "Select * from package_category where 1 "+sqlFilterHandler(req?.query)
    const [data] = await sequelize.query(query)

    return res.status(200).json({
        status:'success',
        message:"Categories fetched successfully",
        data:data
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
    const {} = req?.body
    const query = "Select * from package_category where 1 "+sqlFilterHandler(req?.query)
    const [data] = await sequelize.query(query)

    return res.status(200).json({
        status:'success',
        message:"Categories fetched successfully",
        data:data
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