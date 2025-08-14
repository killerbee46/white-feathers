import express from "express";
import { createFutsal, deleteFutsal, getFutsal, getFutsals, getFutsalsByOwner, getPopularFutsals, updateFutsal } from "../controllers/futsalController.js";

const router = express.Router();

router.get("/", getFutsals);
router.get("/owner", getFutsalsByOwner);
router.get("/popular", getPopularFutsals);
router.post("/create", createFutsal);
router.get("/:id", getFutsal);
router.put("/update/:id", updateFutsal);
router.post("/delete/:id", deleteFutsal);

export default router