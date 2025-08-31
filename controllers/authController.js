import dayjs from "dayjs";
import OTP from "../models/OTP.js";
import userModel from "../models/userModel.js";

import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import { verifyOtp } from "./otpController.js";

export const registerController = async (req, res) => {
  try {
    const { otp, data } = req?.body;
    const { email, phone } = data;
    const exisitingUser = await userModel.findOne({ email });
    const exisitingPhone = await userModel.findOne({ phone });

    if (exisitingUser) {
      return res.status(409).send({
        success: false,
        message: "Already Register please login",
      });
    }
    if (exisitingPhone) {
      return res.status(409).send({
        success: false,
        message: "Phone already registered to another user",
      });
    }
    const otpData = await OTP.findOne({ phone: phone }, "otp otp_expiry")
    const expired = (dayjs() - dayjs(otpData.otp_expiry)) > 0

    if (expired) {
      return res.status(400).send({
        status: 'failed',
        message: "OTP has expired. Please renew OTP.",
      });
    }

    const otpMatch = otpData.otp == otp;

    if (otpMatch) {
      const user = await new userModel({
        ...data,
        role: 1,
        otp: otp
      }).save();
      return res.status(201).send({
        success: true,
        message: "User Register Successfully",
      });
    }
    else {
      return res.status(409).json({
        status: 'failed',
        message: "Otp did not Match"
      })
    }

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while Registering",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email: em, password, phone } = req.body;
    const email = em?.toLowerCase()

    //validation
    if (!(email || phone) || !password) {
      return res.status(409).send({
        status: "failed",
        message: "Email/phone and Password both are required",
      });
    }
    //check user
    const user = await userModel.findOne({ $or:[{phone},{email}] }, "name password address phone otp");
    if (!user) {
      return res.status(409).send({
        success: false,
        message: "User not registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(409).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET);

    if (!user.otp) {
      req.body = {
        ...req.body,
        phone: user?.phone
      }
      verifyOtp(req, res)
    }
    else {
      return res.status(201).send({
        success: true,
        message: "Logged in successfully",
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const unverifiedLoginController = async (req, res) => {
  try {
    const { otp, data } = req?.body;
    const { phone, email: em } = data;
    const email = em?.toLowerCase()
    const otpData = await OTP.findOne({ phone: phone }, "otp otp_expiry")
    const user = await userModel.findOne({ email }, "")
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET);
    const expired = (dayjs() - dayjs(otpData.otp_expiry)) > 0
    if (expired) {
      return res.status(400).send({
        status: 'failed',
        message: "OTP has expired. Please renew OTP.",
      });
    }

    const otpMatch = otpData.otp == otp;

    if (otpMatch) {
      await userModel.findByIdAndUpdate(
        user?._id,
        {
          otp: otp
        })
      return res.status(201).json({
        status: "success",
        message: "Logged in successfully",
        token
      });
    }
    else {
      return res.status(409).json({
        status: 'failed',
        message: "Otp did not Match"
      })
    }

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while Logging in",
      error,
    });
  }
};

//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { otp, password, data } = req?.body;
    const { phone } = data;
    const otpData = await OTP.findOne({ phone: phone }, "otp otp_expiry")
    const user = await userModel.findOne({ phone }, "")
    const expired = (dayjs() - dayjs(otpData.otp_expiry)) > 0

    if (expired) {
      return res.status(400).send({
        status: 'failed',
        message: "OTP has expired. Please renew OTP.",
      });
    }

    const otpMatch = otpData.otp == otp;

    if (otpMatch) {
      const hashed = await hashPassword(password);
      await userModel.findByIdAndUpdate(user._id, { password: hashed });
      return res.status(200).send({
        success: true,
        message: "Password Reset Successfully",
      });
    }
    else {
      return res.status(409).json({
        status: 'failed',
        message: "Otp did not Match"
      })
    }

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};
