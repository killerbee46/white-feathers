import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createOrder, getOrders, getOrdersByUser } from "../controllers/orderController.js";

const router = express.Router();

router.post("/",requireSignIn, createOrder);
router.get("/",requireSignIn,
    // isAdmin, 
    getOrders);
router.get("/me",requireSignIn,
    getOrdersByUser);

export default router