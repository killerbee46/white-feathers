import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createOrder, getOrderDetails, getOrders, getOrdersByUser } from "../controllers/orderController.js";
import { initializeEsewaPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", requireSignIn, createOrder);
router.post("/esewa", requireSignIn, initializeEsewaPayment);
router.get("/", requireSignIn,
    isAdmin,
    getOrders);
router.get("/me", requireSignIn,
    getOrdersByUser);
router.get("/:id", requireSignIn,
    getOrderDetails);

export default router