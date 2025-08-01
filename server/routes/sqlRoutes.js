import express from "express";
import { createOrder, getCategories, getOrders, getOrdersByUser, getProduct, getProducts } from "../controllers/sqlControllers.js";
import { checkForSignIn, isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { completeEsewaPayment, failedEsewaPayment, initializeEsewaPayment } from "../controllers/paymentController.js";
import { verifyEsewaPayment } from "../utils/esewa.js";

const router = express.Router();

// products routes
router.get("/products",checkForSignIn, getProducts);
router.get("/products/:id",checkForSignIn, getProduct);

// categories routes
router.get("/categories",getCategories);

//order 
router.post("/orders",requireSignIn,createOrder);
router.get("/orders",requireSignIn, isAdmin,getOrders);
router.get("/orders/me",requireSignIn,getOrdersByUser);
router.post("/initialize-esewa",requireSignIn,initializeEsewaPayment);
router.get("/complete-payment",requireSignIn, completeEsewaPayment);
router.get("/complete-payment", failedEsewaPayment);

export default router