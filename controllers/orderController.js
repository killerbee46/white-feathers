import { Op } from "sequelize";
import CartDetails from "../models/CartDetails.js";
import Order from "../models/Order.js";
import PackageSlider from "../models/PackageSlider.js";
import Product from "../models/Product.js";
import Material from "../models/Material.js";
import Metal from "../models/Metal.js";
import productPrice from "../utils/productPrice.js";
import User from "../models/User.js";
import dayjs from "dayjs";

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
            ],
            order:[['cb_id',"DESC"]]
        })

        const ordDetails = ord?.map((o) => {
            let totalPrice = 0
            let pdiscount = 0
            const temp = JSON.parse(o?.cookie_id)?.products ?? o?.CartDetails
            const products = temp?.map((p) => {
                const price = p.dynamic_price ?? p.rate
                const quantity = p.quantity ?? p.qty
                totalPrice += price * quantity;
                pdiscount += p.discount * quantity;
                return {
                    id: p?.id ?? p?.id_pack,
                    title: p?.title ?? p?.Product?.p_name,
                    image: p?.image ?? p?.Product?.image ?? p?.Product?.Images[0]?.s_path,
                    dynamic_price: price,
                    discount: p.discount,
                    quantity: quantity
                }
            })
            return {
                cb_id: o?.cb_id,
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

        const user = await User.findByPk(userId)

        const ord = await Order.findAll({
            where: { [Op.and]: [{ c_id: userId }, { checkout: { [Op.ne]: 0 } }] },
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
            ],
            order:[['cb_id',"DESC"]]
        })

        if (user?.role < 3) {
            if (ord?.c_id != userId) {
                return res.status(403).send({
                    status: 'failed',
                    message: "Not authorized to access data"
                })
            }
        }

        const ordDetails = ord?.map((o) => {
            let totalPrice = 0
            let pdiscount = 0
            const temp = JSON.parse(o?.cookie_id)?.products ?? o?.CartDetails
            const products = temp?.map((p) => {
                const price = p.dynamicPrice ?? p.rate
                const quantity = p.quantity ?? p.qty
                totalPrice += price * quantity;
                pdiscount += p.discount * quantity;
                return {
                    id: p?.id ?? p?.id_pack,
                    title: p?.title ?? p?.Product?.p_name,
                    image: p?.image ?? p?.Product?.image ?? p?.Product?.Images[0]?.s_path,
                    dynamicPrice: price,
                    discount: p.discount,
                    quantity: quantity
                }
            })
            return {
                cb_id: o?.cb_id,
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

export const getOrderDetails = async (req, res) => {
    try {
        const userId = req?.user?.id
        const orderid = req?.params?.id

        const user = await User.findByPk(userId)

        const o = await Order.findByPk(orderid, {
            where: { [Op.and]: [{ c_id: userId }, { checkout: { [Op.ne]: 0 } }] },
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
            ]
        })

        if (user?.role < 3) {
            if (o?.c_id != userId) {
                return res.status(403).send({
                    status: 'failed',
                    message: "Not authorized to access data"
                })
            }
        }

        let totalPrice = 0
        let pdiscount = 0
        const temp = JSON.parse(o?.cookie_id)?.products ?? o?.CartDetails
        const products = temp?.map((p) => {
            const price = p?.dynamicPrice ?? p?.rate
            const quantity = p?.quantity ?? p.qty
            totalPrice += price * quantity;
            pdiscount += p.discount * quantity;
            return {
                id: p?.id ?? p?.id_pack,
                title: p?.title ?? p?.Product?.p_name,
                image: p?.image ?? p?.Product?.image ?? p?.Product?.Images[0]?.s_path,
                dynamic_price: price * quantity,
                discount: p.discount,
                quantity: quantity
            }
        })
        const ordDetails = {
            cb_id: o?.cb_id,
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

        return res.status(200).json({
            status: 'success',
            message: "Order details fetched successfully",
            data: ordDetails
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting order details",
        });
    }
};

export const createOrder = async (req, res) => {
    try {
        const userId = req?.user?.id
        const user = await User.findByPk(userId, { attributes: ['name', 'address', 'phone', "email"] })
        const { products: temp, name, address, msg } = req?.body
        const ids = temp?.map((t) => t?.id)

        const goldPrice = await Material.findByPk(2, { attributes: ["price"] })
        const silverPrice = await Material.findByPk(3, { attributes: ["price"] })
        const diamondPrice = await Material.findByPk(1, { attributes: ["price", "discount"] })
        const allProducts = await Product.findAll({
            where: { id_pack: ids },
            include: [{ model: Metal, required: true }, {
                model: PackageSlider,
                attributes: ['s_path'],
                limit: 1
            }]
        })

        const products = temp?.map((t) => {
            const product = allProducts.find((f) => f?.id_pack === t?.id)
            const productDetail = productPrice({ productData: product?.dataValues, goldPrice: goldPrice?.price, silverPrice: silverPrice?.price, diamondPrice: diamondPrice, details: false })
            return { ...productDetail, quantity: t?.quantity }
        })

        await Order.create({
            name: name ?? user?.name,
            cno: user?.phone,
            email: user?.email,
            address: address ?? user?.address,
            msg: msg,
            cookie_id: JSON.stringify({ products: products }),
            checkout: 1,
            mode: 1,
            tracking_code: dayjs().unix(),
            cur_id: 1,
            dispatch: 0,
            deliver: 0,
            c_id: userId,
            p_date: dayjs().format("YYYY-MM-DD")
        })

        return res.status(201).send({
            status: 'success',
            message: "Order Placed Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while adding to order",
            error
        });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const userId = req?.user?.id
        const orderId = req?.params?.id

        const order = await Order.findByPk(orderId)

        const user = await User.findByPk(userId, { attributes: ['name', 'address', 'phone', "email"] })
        const { products: temp, name, address, msg } = req?.body
        const ids = temp?.map((t) => t?.id)

        const goldPrice = await Material.findByPk(2, { attributes: ["price"] })
        const silverPrice = await Material.findByPk(3, { attributes: ["price"] })
        const diamondPrice = await Material.findByPk(1, { attributes: ["price", "discount"] })
        const allProducts = await Product.findAll({
            where: { id_pack: ids },
            include: [{ model: Metal, required: true }, {
                model: PackageSlider,
                attributes: ['s_path'],
                limit: 1
            }]
        })

        const products = temp?.map((t) => {
            const product = allProducts.find((f) => f?.id_pack === t?.id)
            const productDetail = productPrice({ productData: product?.dataValues, goldPrice: goldPrice?.price, silverPrice: silverPrice?.price, diamondPrice: diamondPrice, details: false })
            return { ...productDetail, quantity: t?.quantity }
        })

        let totalPrice = 0
        let totalDiscount = 0
        let totalFinalPrice = 0

        products?.map((p) => {
            totalPrice += (p?.dynamicPrice * p?.quantity)
            totalDiscount += (p?.discount * p?.quantity)
            totalFinalPrice += (p?.finalPrice * p?.quantity)
        })

        await Order.create({
            name: name ?? user?.name,
            cno: user?.phone,
            email: user?.email,
            address: address ?? user?.address,
            msg: msg,
            cookie_id: JSON.stringify({ products: products }),
            checkout: 1,
            mode: 1,
            tracking_code: dayjs().unix(),
            cur_id: 1,
            dispatch: 0,
            deliver: 0,
            c_id: userId,
            p_date: dayjs().format("YYYY-MM-DD")
        })

        return res.status(201).send({
            status: 'success',
            message: "Order Placed Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while adding to order",
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