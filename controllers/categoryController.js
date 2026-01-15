import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { cat_name, cat_pic } = req.body;
    if (!cat_name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await Category.findOne({where:{ cat_name }});
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category Already Exists",
      });
    }
    const category = await Category.create({
      ...req?.body
    });
    res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while creating Category",
    });
  }
};

//update category
export const updateCategory = async (req, res) => {
  try {
    const { cat_name, cat_pic } = req.body;
    const { id } = req.params;
    if (!cat_name) {
      return res.status(401).send({ message: "Category Name is required" });
    }
    const category = await Category.findByPk(id)
    await category.update(
      { ...req?.body}
    );
    res.status(201).send({
      success: true,
      messsage: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

// get all cat
export const getCategories = async (req, res) => {
  try {
    const category = await Category.findAll({});
    return res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// single category
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req?.params?.id);
    res.status(200).send({
      success: true,
      message: "Get Single Category Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};

//delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(req?.params?.id);
    await category.destroy(id);
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting category",
      error,
    });
  }
};
