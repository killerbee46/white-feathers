import express from "express";
import { addWishlist, getWishlist, removeWishlist } from "../controllers/wishlistController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/",requireSignIn, getWishlist);
router.post("/:productId",requireSignIn, addWishlist);
router.delete("/:productId",requireSignIn, removeWishlist);

export default router