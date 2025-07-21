import express from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/userController.js";
import { getCategories, getProduct, getProducts } from "../controllers/sqlControllers.js";

const router = express.Router();

// products routes
router.get("/products", getProducts);
router.get("/products/:id", getProduct);

// categories routes
router.get("/categories",getCategories);

export default router