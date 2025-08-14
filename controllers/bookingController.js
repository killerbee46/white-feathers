import Booking from "../models/Booking.js";
import { filterHandler } from "../utils/filterHandler.js";

export const getBookings = async (req, res) => {
    try {
      const bookings = await Booking.find({})?.populate("booker")?.populate("futsal");
      res.status(200).send({
        bookings
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting booking list",
      });
    }
  };

  export const getBookingByFutsal = async (req, res) => {
    try {
      const booking = await Booking.find(filterHandler(req?.query)).lean();
      res.status(200).send({
        success: true,
        message: "Bookings Loaded",
        booking,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting booking detail",
      });
    }
  };

  export const getBookingByUser = async (req, res) => {
    try {
      const booking = await Booking.find({
        booker:{$eq:req?.query?.booker},
        status:{$regex:req?.query?.status
          
        }})?.populate("futsal").lean();
      res.status(200).send({
        success: true,
        message: "Bookings Loaded",
        booking,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting booking detail",
      });
    }
  };

export const addBooking = async (req, res) => {
    try {
      const { date, time, booker, futsal, rate, name, contact } = req.body;
      //validations
      if (!booker) {
        return res.status(400).send({ error: "Booker detail is Required" });
      }
      if (!futsal) {
        return res.status(400).send({ error: "Futsal detail is Required" });
      }
      if (!date) {
        return res.status(400).send({ error: "Date is Required" });
      }
      if (!time) {
        return res.status(400).send({ error: "Time is Required" });
      }
      const booking = await new Booking({
        date,
        time,
        booker,
        futsal,
        rate,
        name, 
        contact
      }).save();
  
      res.status(201).send({
        success: true,
        message: "Futsal booked Successfully",
        booking,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while booking futsal",
        error,
      });
    }
  };

  export const cancelBooking = async (req, res) => {
    try {
      const { date, time, booker, futsal, rate, name, contact } = req.body;
      //validations
      if (!booker) {
        return res.status(400).send({ error: "Booker detail is Required" });
      }
      if (!futsal) {
        return res.status(400).send({ error: "Futsal detail is Required" });
      }
      if (!date) {
        return res.status(400).send({ error: "Date is Required" });
      }
      if (!time) {
        return res.status(400).send({ error: "Time is Required" });
      }
      const booking = await Booking.findByIdAndUpdate(req.params.id,{
        date,
        time,
        booker,
        futsal,
        rate,
        name, 
        contact,
        status:'Cancelled'
      });
      await booking.save()
  
      res.status(201).send({
        success: true,
        message: "Futsal Cancelled Successfully",
        booking,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while cancelling booking ",
        error,
      });
    }
  };