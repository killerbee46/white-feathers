import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";
import { createProduct, deleteProduct, getProduct, getProducts, productCategory, updateProduct } from "../controllers/productController.js";

const router = express.Router();

//routes
router.post(
  "/",
//   requireSignIn,
//   isAdmin,
//   formidable(),
  createProduct
);
//routes
router.put(
  "/:id",
//   requireSignIn,
//   isAdmin,
//   formidable(),
  updateProduct
);

//get products
router.get("/", getProducts);

//single product
router.get("/:id", getProduct);

//single product
router.get("/category/:id", productCategory);

//delete product
router.delete("/:id", deleteProduct);

export default router;
