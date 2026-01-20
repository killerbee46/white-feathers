import { sequelize } from "../config/tempDb.js";
import Order from "../models/Order.js";
import { sqlProductFetch } from "../utils/sqlProductFetch.js";

export const getOrders = async (req, res) => {
    try {

        const ord = await Order.findAll({ where: {checkout:{$not:0}} })

        const ordDetails = ord?.map((o) => {
            let totalPrice = 0
            let pdiscount = 0
            const products = JSON.parse(o?.cookie_id)?.products ?? []
            products?.map((p) => {
                totalPrice += (p.dynamic_price * p.quantity + p.discount * p.quantity);
                pdiscount += p.discount * p.quantity;
            })
            delete o.cookie_id
            return {
                ...o.dataValues,
                products: products,
                totalPrice: totalPrice,
                totalDiscount: pdiscount,
                finalPrice: (totalPrice - pdiscount)
            }
        })

        return res.status(200).json({
            status: 'success',
            message: "Orders fetched successfully",
            data: ordDetails

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting users orders",
        });
    }
};

export const getOrdersByUser = async (req, res) => {
    try {
        const userId = req?.user?.id

        const ord = await Order.findAll({ where: {$and:[{ c_id: userId}, {checkout:{$not:0}} ]} })

        const ordDetails = ord?.map((o) => {
            let totalPrice = 0
            let pdiscount = 0
            const products = JSON.parse(o?.cookie_id)?.products ?? []
            products?.map((p) => {
                totalPrice += (p.dynamic_price * p.quantity + p.discount * p.quantity);
                pdiscount += p.discount * p.quantity;
            })
            return {
                products: products,
                totalPrice: totalPrice,
                totalDiscount: pdiscount,
                finalPrice: (totalPrice - pdiscount)
            }
        })

        return res.status(200).json({
            status: 'success',
            message: "Orders fetched successfully",
            data: ordDetails

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting users orders",
        });
    }
};


export const createOrder = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req?.user?._id
        const cart = await Cart.findOne({ userId: userId })
        req.body.userId = userId
        let list = []

        const query = sqlProductFetch("p.p_name as title,") + ` and p.id_pack = ${productId} `
        const [data] = await sequelize.query(query)
        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to add" });
        }

        if (cart) {
            list = cart?.products
            const existingIds = cart.products?.map((p) => p?.id)
            if (existingIds.includes(parseInt(productId))) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product already in the Cart'
                })
            }
            // list.push(productId)
            const wish = await Cart.findByIdAndUpdate(cart?._id, {
                $push: { products: { ...data[0], quantity: 1 } }
            })
            return res.status(201).json({
                status: 'success',
                message: "Added to Cart"
            })
        } else {
            list.push({ ...data[0], quantity: 1 })
            const wish = new Cart({
                userId: userId,
                products: list
            }).save()
            return res.status(201).json({
                status: 'success',
                message: "Added to Cart",
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while adding to Cart",
            error
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req?.body
        const userId = req?.user?._id
        const cart = await Cart.findOne({ userId: userId })
        req.body.userId = userId
        let list = []
        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to remove" });
        }

        if (cart) {
            list = cart?.products

            const updatedList = list.map((l) => {
                if (l.id == productId) {
                    return { ...l, quantity: quantity };
                } else {
                    return l;
                }
            });

            // list.push(productId)
            const wish = await Cart.findByIdAndUpdate(cart?._id, {
                products: updatedList
            })
            return res.status(201).json({
                status: 'success',
                message: "Updated product in Cart"
            })
        } else {
            return res.status(400).json({
                status: 'failed',
                message: "No product in the Cart",
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while adding to Cart",
            error
        });
    }
};

export const removeCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req?.user?._id
        const cart = await Cart.findOne({ userId: userId })
        req.body.userId = userId
        let list = []
        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to remove" });
        }

        if (cart) {
            list = cart?.products

            const newList = list?.filter((f) => f.id != productId)

            const existingIds = cart.products?.map((p) => p.id)
            if (!existingIds.includes(parseInt(productId))) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product is not in the Cart'
                })
            }
            // list.push(productId)
            const wish = await Cart.findByIdAndUpdate(cart?._id, {
                products: newList
            })
            return res.status(201).json({
                status: 'success',
                message: "Removed from Cart"
            })
        } else {
            return res.status(400).json({
                status: 'failed',
                message: "No product in the Cart",
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while adding to Cart",
            error
        });
    }
};