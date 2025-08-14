import express from "express";
import { addBooking, cancelBooking, getBookingByFutsal, getBookingByUser, getBookings } from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", getBookings);
router.post("/add", addBooking);
router.put("/:id", cancelBooking);
router.get("/futsal", getBookingByFutsal);
router.get("/user", getBookingByUser);
// router.get("/:userId", getBookingByUser);
// router.put("/update/:id", updateFutsal);
// router.post("/delete/:id", deleteFutsal);

export default router