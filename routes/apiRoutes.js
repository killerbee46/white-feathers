import express from "express";
import authRoutes from "./authRoute.js";
import productRoutes from "./productRoutes.js";
import userRoutes from "./userRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import profileRoutes from "./profileRoutes.js";
import orderRoutes from "./orderRoutes.js";
import sqlRoutes from "./sqlRoutes.js";
import wishlistRoutes from "./wishlistRoutes.js";
import cartRoutes from "./cartRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import currencyRoutes from "./currencyRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import { calculatePrice } from "../controllers/priceCalculatorController.js";
import materialRoutes from "./materialRoutes.js";
import metalRoutes from "./metalRoutes.js";

const router = express.Router();

router.get("/",(req, res)=>{
    return res.status(200).send({ 
        message:"Welcome to White Feather's Jewellery's Api",
        user:req?.user
    })
})

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/booking", bookingRoutes);
router.use("/profile", profileRoutes);
router.use("/orders", orderRoutes);
router.use("/sql", sqlRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/cart", cartRoutes);
router.use("/reviews", reviewRoutes);
router.post("/price-calculator", calculatePrice)
router.use("/currency", currencyRoutes)
router.use("/notifications", notificationRoutes)
router.use("/materials", materialRoutes);
router.use("/metals", metalRoutes);

export default router