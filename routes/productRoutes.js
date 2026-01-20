import express from "express";
import { checkForSignIn, isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProduct, deleteProduct, getProduct, getProductsWQuery, productCategory, updateProduct } from "../controllers/productController.js";

const router = express.Router();

//routes
router.post(
  "/",
  requireSignIn,
  isAdmin,
  createProduct
);
//routes
router.put(
  "/:id",
  requireSignIn,
  isAdmin,
  updateProduct
);

//get products
router.get("/", checkForSignIn, getProductsWQuery);

//single product
router.get("/:id", checkForSignIn, getProduct);

//single product
router.get("/category/:id", productCategory);

//delete product
router.delete("/:id", deleteProduct);

export default router;
