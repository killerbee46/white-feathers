import { sequelize } from "../config/tempDb.js";
import Cart from "../models/Cart.js";
import Material from "../models/Material.js";
import Metal from "../models/Metal.js";
import PackageSlider from "../models/PackageSlider.js";
import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";
import productPrice from "../utils/productPrice.js";
import { sqlProductFetch } from "../utils/sqlProductFetch.js";

export const getCart = async (req, res) => {
    try {
        const userId = req?.user?.id
        const cart = await Cart.findOne({ userId: userId })
        const temp = JSON.parse(cart?.products || "[]")
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

        return res.status(200).json({
            status: 'success',
            message: "Cart fetched successfully",
            data: {
                products: products,
                totalPrice: totalPrice.toFixed(2),
                discount: totalDiscount.toFixed(2),
                finalPrice: totalFinalPrice.toFixed(2)
            },

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


export const addCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req?.user?.id
        const cart = await Cart.findOne({ userId: userId })
        // const wishlist = await Wishlist.findOne({ userId: userId })
        req.body.userId = userId

        const list = JSON.parse(cart?.products || "[]")

        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to add" });
        }
        // if(wishlist){
        //     const existingWishlist = wishlist?.products?.map((p)=> p?.id )
        //     if (existingWishlist.includes(parseInt(productId))) {
        //         return res.status(409).json({
        //             status: 'failed',
        //             message: 'Product is in the wishlist'
        //         })
        //     }
        // }

        if (cart) {
            const existingIds = list?.some((p) => p?.id == productId)
            if (existingIds) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product already in the Cart'
                })
            }
            else {
                list.push({ id: parseInt(productId), quantity: 1 })
                const wish = await cart.update({
                    products: JSON.stringify(list)
                })
                return res.status(201).json({
                    status: 'success',
                    message: "Added to Cart"
                })
            }
        } else {
            list.push({ id: parseInt(productId), quantity: 1 })
            const wish = await Cart.create({
                userId: userId,
                products: JSON.stringify(list)
            })
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

export const updateCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req?.body
        const userId = req?.user?._id
        const cart = await Cart.findOne({ userId: userId })
        const list = JSON.parse(cart?.products || "[]")
        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to update" });
        }

        if (cart) {

            const updatedList = list.map((l) => {
                if (l.id == productId) {
                    return { ...l, quantity: quantity };
                } else {
                    return l;
                }
            });

            // list.push(productId)
            const wish = await cart.update({
                products: JSON.stringify(updatedList)
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
        const list = JSON.parse(cart?.products || "[]")
        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to remove" });
        }

        if (cart) {
            const existingIds = list?.some((p) => p?.id == productId)
            if (!existingIds) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product not in the Cart'
                })
            }
            else {
                const newList = list?.filter((f) => f.id != productId)
                // list.push(productId)
                const wish = await cart.update({
                    products: JSON.stringify(newList)
                })
                return res.status(201).json({
                    status: 'success',
                    message: "Removed from Cart"
                })
            }
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
            message: "Error while deleting from Cart",
            error
        });
    }
};

export const switchToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req?.user?._id
        const wishlist = await Wishlist.findOne({ userId: userId })
        const cart = await Cart.findOne({ userId: userId })
        req.body.userId = userId
        let list = []

        const query = sqlProductFetch("p.p_name as title,") + ` and p.id_pack = ${productId} `
        const [data] = await sequelize.query(query)
        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to add" });
        }
        list = cart?.products

        const newList = list?.filter((f) => f.id != productId)

        const existingCart = cart?.products?.map((p) => p.id)
        if (!existingCart.includes(parseInt(productId))) {
            return res.status(409).json({
                status: 'failed',
                message: 'Product is not in the cart'
            })
        }
        // list.push(productId)
        const wish = await Cart.findByIdAndUpdate(cart?._id, {
            products: newList
        })
        if (wishlist) {
            list = wishlist?.products
            const existingIds = wishlist.products?.map((p) => p?.id)
            if (existingIds.includes(parseInt(productId))) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product already in the Wishlist'
                })
            }
            // list.push(productId)
            const wishlistCreate = await Wishlist.findByIdAndUpdate(wishlist?._id, {
                $push: { products: { ...data[0] } }
            })



            return res.status(201).json({
                status: 'success',
                message: "Switched to Wishlist"
            })
        } else {
            list.push({ ...data[0] })
            const wish = new Wishlist({
                userId: userId,
                products: list
            }).save()
            return res.status(201).json({
                status: 'success',
                message: "Switched to Wishlist",
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while switching to Wishlist",
            error
        });
    }
};