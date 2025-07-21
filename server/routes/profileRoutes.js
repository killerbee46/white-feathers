import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", requireSignIn, getProfile);
router.post("/", requireSignIn, updateProfile);

export default router