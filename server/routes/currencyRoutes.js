import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { addCart, getCart, removeCart, updateCart } from "../controllers/cartController.js";
import { createCurrency, deleteCurrency, getCurrencies, getCurrenciesSql, updateCurrency } from "../controllers/currencyController.js";

const router = express.Router();

router.get("/", getCurrencies);
router.get("/sql", getCurrenciesSql);
router.post("/", createCurrency);
router.patch("/:id", updateCurrency);
router.delete("/:id", deleteCurrency);

export default router