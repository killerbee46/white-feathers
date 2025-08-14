import express from "express";
import { testCreateProduct, testGetProduct, testGetProducts } from "../controllers/testProductController.js";

const router = express.Router();

//routes
router.post(
  "/create-product", testCreateProduct
);
//routes

//get products
router.get("/get-product", testGetProducts);

//single product
router.get("/get-product/:slug", testGetProduct);

export default router;