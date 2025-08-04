import express from "express";
import authRoutes from "./authRoute.js";
import futsalRoutes from "./futsalRoutes.js";
import userRoutes from "./userRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import profileRoutes from "./profileRoutes.js";
import sqlRoutes from "./sqlRoutes.js";
import wishlistRoutes from "./wishlistRoutes.js";
import cartRoutes from "./cartRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import currencyRoutes from "./currencyRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import { calculatePrice } from "../controllers/priceCalculatorController.js";

const router = express.Router();

router.get("/",(req, res)=>{
    return res.send(200, { 
        message:"Welcome to White Feather's Jewellery's Api",
        user:req?.user
    })
})

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", futsalRoutes);
router.use("/users", userRoutes);
router.use("/booking", bookingRoutes);
router.use("/profile", profileRoutes);
router.use("/sql", sqlRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/cart", cartRoutes);
router.use("/reviews", reviewRoutes);
router.post("/price-calculator", calculatePrice)
router.use("/currency", currencyRoutes)
router.use("/notifications", notificationRoutes)

export default router