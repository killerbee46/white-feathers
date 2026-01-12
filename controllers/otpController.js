import dayjs from "dayjs";
import OTP from "../models/OTP.js";
import { generateOTP } from "../utils/generateOTP.js";
import { hashPassword } from "../helpers/authHelper.js";
import User from "../models/User.js";
import { Op } from "sequelize";

export const createOtp = async (req, res) => {
    try {
        const { name, email: em, password, phone, address } = req?.body;
        const email = em?.toLowerCase()
        //validations
        if (!name) {
            return res.send({ error: "Name is Required" });
        }
        if (!password) {
            return res.send({ error: "Password is Required" });
        }
        if (!phone) {
            return res.send({ error: "Phone no is Required" });
        }
        if (!address) {
            return res.send({ error: "Address is Required" });
        }
        //check user
        const exisitingUser = await User.findOne({ where: { email } }, { attributes:{include:[]} });
        const exisitingPhone = await User.findOne({ where: { phone } }, { attributes:{include:[]} });

        if (exisitingUser) {
            return res.status(409).send({
                success: false,
                message: "Email Already Registered please login",
            });
        }
        if (exisitingPhone) {
            return res.status(409).send({
                success: false,
                message: "Phone already registered to another user",
            });
        }

        const hashedPassword = await hashPassword(password);

        const otpExists = await OTP.findOne({ where: { phone } })
        const otp = generateOTP()
        const sparrowUrl = new URL(`https://api.sparrowsms.com/v2/sms/?from=InfoAlert&to=${phone}&text=White Feather's - OTP: ${otp}&token=v2_Nd8UndHle6pYCSWXvLjkjOChhNd.GIYi`);

        if (otpExists) {
            await fetch(sparrowUrl)
            const newToken = await otpExists.update({
                phone: phone,
                otp: otp,
                otp_expiry: dayjs().add(5, 'minutes')
            })

            res.status(201).json({
                message: "New OTP sent to your phone please verify to proceed further",
                otp_expiry: newToken.otp_expiry,
                data: {
                    ...req?.body,
                    email: email,
                    password: hashedPassword
                }
            })
        }
        else {
            await fetch(sparrowUrl)
            const token = await OTP.create({
                phone: phone,
                otp: otp,
                otp_expiry: dayjs().add(5, 'minutes')
            });

            res.status(201).json({
                message: "OTP sent to your phone please verify to proceed further",
                otp_expiry: token?.otp_expiry,
                data: {
                    ...req?.body,
                    email: email,
                    password: hashedPassword
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While Registering",
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email: em, password } = req?.body;
        const email = em?.toLowerCase()

        //validation
        if (!email || !password) {
            return res.status(409).send({
                status: 'failed',
                message: "Email/phone and Password both are required",
            });
        }

        const user = await User.findOne({ where:{[Op.or]: [
              {
                phone: email
              }, {
                email: email
              }
            ]}})
        const otpExists = await OTP.findOne({where:{ phone: user?.phone }},{attributes:{include:["otp","otp_expiry"]}})
        const otp = generateOTP()
        const sparrowUrl = new URL(`https://api.sparrowsms.com/v2/sms/?from=InfoAlert&to=${user?.phone}&text=White Feather's Login - OTP: ${otp}&token=v2_Nd8UndHle6pYCSWXvLjkjOChhNd.GIYi`);

        if (otpExists) {
            await fetch(sparrowUrl)
            const newToken = await otpExists.update(
                {
                    phone: user?.phone,
                    otp: otp,
                    otp_expiry: dayjs().add(5, 'minutes')
                }
            );

            res.status(201).json({
                message: "OTP sent to your phone please verify to proceed further",
                otp_expiry: newToken.otp_expiry,
                data: {
                    ...req?.body
                }
            })
        }
        else {
            await fetch(sparrowUrl)
            const token = await new OTP({
                phone: phone,
                otp: otp,
                otp_expiry: dayjs().add(5, 'minutes')
            }).save();

            res.status(201).json({
                message: "OTP sent to your phone please verify to proceed further",
                otp_expiry: token?.otp_expiry,
                data: {
                    ...req?.body
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While Logging in",
        });
    }
};

export const changePasswordOtp = async (req, res) => {
    try {
        const { phone } = req?.body;
        //validations
        if (!phone) {
            return res.send({ error: "Phone is Required" });
        }


        const otpExists = await OTP.findOne({where: {phone} })
        const otp = generateOTP()
        const sparrowUrl = new URL(`https://api.sparrowsms.com/v2/sms/?from=InfoAlert&to=${phone}&text=White Feather's Login - OTP: ${otp}&token=v2_Nd8UndHle6pYCSWXvLjkjOChhNd.GIYi`);

        if (otpExists) {
            await fetch(sparrowUrl)
            const newToken = await otpExists.update(
                {
                    phone: phone,
                    otp: otp,
                    otp_expiry: dayjs().add(5, 'minutes')
                }
            );

            return res.status(201).json({
                message: "OTP sent to your phone please verify to proceed further",
                otp_expiry: newToken.otp_expiry,
                data: {
                    ...req?.body
                }
            })
        }
        else {
            await fetch(sparrowUrl)
            const token = await OTP.create({
                phone: phone,
                otp: otp,
                otp_expiry: dayjs().add(5, 'minutes')
            });

            res.status(201).json({
                message: "OTP sent to your phone please verify to proceed further",
                otp_expiry: token?.otp_expiry,
                data: {
                    ...req?.body
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While Logging in",
        });
    }
};