import Notification from "../models/Notification.js";
import userModel from "../models/userModel.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req?.user?._id
        const user = await userModel.findById(userId,"role")
        const filters = user?.role === 3 ? {} :user?.role === 2 ?{to:{$in:["both","employee"]}}:{to:{$in:["both","user"]}}
        const notifications = await Notification.find(filters)

        const mod = notifications?.map((not)=> {
            let opened = false
            if (not?.opened.find((f)=> f == userId)) {
                opened = true
            }
            return {
                ...not?._doc,
                read:opened
            }
        })

        return res.status(200).json({
            status: 'success',
            message: "Notifications Fetched Successfully",
            role:user?.role === 3,
            data: mod

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting users cart",
        });
    }
};

export const openNotification = async (req, res) => {
    try {
        const userId = req?.user?._id
        const {id} = req?.params
        const notification = await Notification.findById(id,'opened').lean()
        const update = notification?.opened?.find((f)=> f == userId) ? {} : { $push: { opened: userId }}
        const opened = await Notification.findByIdAndUpdate(id,{
           ...update
        }, {new:true})
        return res.status(200).json({
            status: 'success',
            message: "Notifications Opened Successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting users cart",
        });
    }
};

export const createNotification = async (req, res) => {
    try {
        
        const userId = req?.user?._id
        const { title, description, to } = req?.body

        if (!title || !description) {
            return res.send({ error: "Both title and description are required" });
        }

        const created = await new Notification({
            ...req?.body,
            createdBy:userId
        }).save()

            return res.status(201).json({
                status: 'success',
                message: "Notifications Added ",
                data:created
            })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while adding to Cart",
            error
        });
    }
};
