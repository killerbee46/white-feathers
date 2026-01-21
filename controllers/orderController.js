import { Op } from "sequelize";
import { sequelize } from "../config/tempDb.js";
import CartDetails from "../models/CartDetails.js";
import Order from "../models/Order.js";
import PackageSlider from "../models/PackageSlider.js";
import Product from "../models/Product.js";
import { sqlProductFetch } from "../utils/sqlProductFetch.js";

export const getOrders = async (req, res) => {
    try {
        const filters = {
            [Op.and]: [
                { checkout: { [Op.ne]: 0 } },
                { dispatch: { [Op.eq]: 0 } },
                { deliver: { [Op.eq]: 0 } },
            ]
        }
        const ord = await Order.findAll({
            where: { ...filters }, include: [
                {
                    model: CartDetails,
                    include: [
                        {
                            model: Product,
                            attributes: ['image', 'p_name'],
                            include: [PackageSlider]
                        },
                    ]
                }
            ]
        })

        const ordDetails = ord?.map((o) => {
            let totalPrice = 0
            let pdiscount = 0
            const temp = JSON.parse(o?.cookie_id)?.products ?? o?.CartDetails
            const products = temp?.map((p) => {
                const price = p.dynamic_price ?? p.rate
                const quantity = p.quantity ?? p.qty
                totalPrice += (price * quantity + p.discount * quantity);
                pdiscount += p.discount * quantity;
                return {
                    id: p?.id ?? p?.id_pack,
                    title: p?.title ?? p?.Product?.p_name,
                    image: p?.image ?? p?.Product?.image ?? p?.Product?.Images[0]?.s_path,
                    dynamic_price: price,
                    quantity: quantity
                }
            })
            return {
                name: o?.name,
                address: o?.address,
                cno: o?.cno,
                book_date: o?.book_date,
                p_date: o?.p_date,
                mode: o?.mode,
                dispatch: o?.dispatch,
                deliver: o?.deliver,
                checkout: o?.checkout,
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

        const ord = await Order.findAll({ where: { [Op.and]: [{ c_id: userId }, { checkout: { [Op.ne]: 0 } }] },
        include: [
                {
                    model: CartDetails,
                    include: [
                        {
                            model: Product,
                            attributes: ['image', 'p_name'],
                            include: [PackageSlider]
                        },
                    ]
                }
            ] })

        const ordDetails = ord?.map((o) => {
            let totalPrice = 0
            let pdiscount = 0
            const temp = JSON.parse(o?.cookie_id)?.products ?? o?.CartDetails
            const products = temp?.map((p) => {
                const price = p.dynamic_price ?? p.rate
                const quantity = p.quantity ?? p.qty
                totalPrice += (price * quantity + p.discount * quantity);
                pdiscount += p.discount * quantity;
                return {
                    id: p?.id ?? p?.id_pack,
                    title: p?.title ?? p?.Product?.p_name,
                    image: p?.image ?? p?.Product?.image ?? p?.Product?.Images[0]?.s_path,
                    dynamic_price: price,
                    quantity: quantity
                }
            })
            return {
                name: o?.name,
                address: o?.address,
                cno: o?.cno,
                book_date: o?.book_date,
                p_date: o?.p_date,
                mode: o?.mode,
                dispatch: o?.dispatch,
                deliver: o?.deliver,
                checkout: o?.checkout,
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