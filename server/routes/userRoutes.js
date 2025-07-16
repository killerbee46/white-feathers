import express from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.post("/delete/:id", deleteUser);

export default router