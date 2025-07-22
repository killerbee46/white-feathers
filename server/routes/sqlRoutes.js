import express from "express";
import { getCategories, getProduct, getProducts } from "../controllers/sqlControllers.js";
import { checkForSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// products routes
router.get("/products",checkForSignIn, getProducts);
router.get("/products/:id",checkForSignIn, getProduct);

// categories routes
router.get("/categories",getCategories);

//order 
router.post("/orders",()=> {});

export default router