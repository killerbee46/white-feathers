import express from "express";
import { createCurrency, deleteCurrency, getCurrencies, getCurrency, updateCurrency } from "../controllers/currencyController.js";

const router = express.Router();

router.get("/", getCurrencies);
router.get("/:id", getCurrency);
router.post("/", createCurrency);
router.patch("/:id", updateCurrency);
router.delete("/:id", deleteCurrency);

export default router