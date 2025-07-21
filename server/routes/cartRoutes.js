import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { addCart, getCart, removeCart, updateCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/",requireSignIn, getCart);
router.post("/:productId",requireSignIn, addCart);
router.patch("/:productId",requireSignIn, updateCart);
router.delete("/:productId",requireSignIn, removeCart);

export default router