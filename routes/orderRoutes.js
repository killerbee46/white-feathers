import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { createOrder } from "../controllers/orderController.js";
import { esewaPay } from "../controllers/paymentController.js";

const router = express.Router();

// router.get("/",requireSignIn, getWishlist);
router.post("/",requireSignIn, createOrder);
// router.delete("/:productId",requireSignIn, removeWishlist);

export default router