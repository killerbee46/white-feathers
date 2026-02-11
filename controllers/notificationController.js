import Notification from "../models/Notification.js";
import User from "../models/User.js";
import userModel from "../models/userModel.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req?.user?.id
        const user = await User.findByPk(userId, { attributes: ["role"] })
        const filters = user?.role === 3 ? {} : user?.role === 2 ? { to: ["both", "employee"] } : { to: ["both", "user"] }
        const notifications = await Notification.findAll({ where: filters })

        const mod = notifications?.map((not) => {
            const temp = JSON.parse(not.opened) ?? [] 
            let opened = false
            if (temp?.find((f) => f == userId)) {
                opened = true
            }
            return {
                ...not?.dataValues,
                opened:temp,
                read: opened
            }
        })

        return res.status(200).json({
            status: 'success',
            message: "Notifications Fetched Successfully",
            role: user?.role === 3,
            data: mod

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting users notification",
        });
    }
};

export const openNotification = async (req, res) => {
    try {
        const userId = req?.user?.id
        const { id } = req?.params
        const notification = await Notification.findByPk(id, { attributes: ['id','opened'] })
        // return res.send({notification})
        const temp = JSON.parse(notification.opened) ?? []
        if (temp?.find((f) => f == userId)) {
            return res.status(200).json({
                status: 'success',
                message: "Notifications Already Opened",
            })
        } else {
            temp?.push(userId)
            await notification.update({
                opened: JSON.stringify(temp)
            })
            return res.status(200).json({
                status: 'success',
                message: "Notifications Opened Successfully",
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error opening notification",
        });
    }
};

export const createNotification = async (req, res) => {
    try {

        const userId = req?.user?.id
        const { title, description, to } = req?.body

        if (!title || !description) {
            return res.send({ error: "Both title and description are required" });
        }

        const created = await Notification.create({
            ...req?.body,
            opened:JSON.stringify([]),
            createdBy: userId
        })

        return res.status(201).json({
            status: 'success',
            message: "Notifications Added !"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while adding to notification",
            error
        });
    }
};
