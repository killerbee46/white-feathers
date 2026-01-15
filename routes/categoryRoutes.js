import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../controllers/categoryController.js";

const router = express.Router();

//routes
// create category
router.post(
  "/",
  requireSignIn,
  isAdmin,
  createCategory
);

//update category
router.put(
  "/:id",
  requireSignIn,
  isAdmin,
  updateCategory
);

//getALl category
router.get("/", getCategories);

//single category
router.get("/:id", getCategory);

//delete category
router.delete(
  "/:id",
  requireSignIn,
  isAdmin,
  deleteCategory
);

export default router;
