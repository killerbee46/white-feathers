import express from "express";
import { getCategories, getProduct, getProducts } from "../controllers/sqlControllers.js";

const router = express.Router();

// products routes
router.get("/products", getProducts);
router.get("/products/:id", getProduct);

// categories routes
router.get("/categories",getCategories);

//order 
router.post("/orders",()=> {});

export default router