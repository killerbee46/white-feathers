import express from "express";
import { checkForSignIn, requireSignIn } from "../middlewares/authMiddleware.js";
import { addReview, getTestimonials, removeReview, updateReview } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/testimonials", checkForSignIn, getTestimonials);
router.post("/",requireSignIn, addReview);
router.patch("/:id",requireSignIn, updateReview);
router.delete("/:id",requireSignIn, removeReview);

export default router