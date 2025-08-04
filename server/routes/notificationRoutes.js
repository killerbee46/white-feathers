import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { createNotification, getNotifications, openNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/",requireSignIn, getNotifications);
router.post("/",requireSignIn, createNotification);
router.get("/:id",requireSignIn, openNotification);

export default router