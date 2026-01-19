import { sequelize } from "../config/tempDb.js";
import Cart from "../models/Cart.js";
import Material from "../models/Material.js";
import Metal from "../models/Metal.js";
import PackageSlider from "../models/PackageSlider.js";
import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";
import productPrice from "../utils/productPrice.js";
import { sqlProductFetch } from "../utils/sqlProductFetch.js";

export const getWishlist = async (req, res) => {
    try {
        const userId = req?.user?.id
        const wish = await Wishlist.findOne({ userId: userId })
        const temp = JSON.parse(wish?.products || "[]")

        const goldPrice = await Material.findByPk(2, { attributes: ["price"] })
        const silverPrice = await Material.findByPk(3, { attributes: ["price"] })
        const diamondPrice = await Material.findByPk(1, { attributes: ["price", "discount"] })
        const allProducts = await Product.findAll({
            where: { id_pack: temp },
            include: [{ model: Metal, required: true }, {
                model: PackageSlider,
                attributes: ['s_path'],
                limit: 1
            }]
        })

        const products = temp?.map((t) => {
            const product = allProducts.find((f) => f?.id_pack === t)
            const productDetail = productPrice({ productData: product?.dataValues, goldPrice: goldPrice?.price, silverPrice: silverPrice?.price, diamondPrice: diamondPrice, details: false })
            return { ...productDetail }
        })

        let totalPrice = 0
        let totalDiscount = 0
        let totalFinalPrice = 0

        products?.map((p) => {
            totalPrice += (p?.dynamicPrice)
            totalDiscount += (p?.discount)
            totalFinalPrice += (p?.finalPrice)
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
            message: "Error while getting users wishlist",
        });
    }
};


export const addWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req?.user?.id
        const wish = await Wishlist.findOne({ userId: userId })
        const cart = await Cart.findOne({ userId: userId })
        req.body.userId = userId

        const list = JSON.parse(wish?.products || "[]")
        const cartList = JSON.parse(cart?.products || "[]")

        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to add" });
        }
        if(cart){
            const existingCart = cartList?.some((p)=> p?.id == productId )
            if (existingCart) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product is in the cart list'
                })
            }
        }

        if (wish) {
            const existingIds = list?.some((p) => p?.id == productId)
            if (existingIds) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product already in the Cart'
                })
            }
            else {
                list.push(parseInt(productId))
                await wish.update({
                    products: JSON.stringify(list)
                })
                return res.status(201).json({
                    status: 'success',
                    message: "Added to Wishlist"
                })
            }
        } else {
            list.push(parseInt(productId))
            await Wishlist.create({
                userId: userId,
                products: JSON.stringify(list)
            })
            return res.status(201).json({
                status: 'success',
                message: "Added to Wishlist",
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while adding to Wishlist",
            error
        });
    }
};

export const removeWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req?.user?._id
        const wish = await Wishlist.findOne({ userId: userId })
        const list = JSON.parse(wish?.products || "[]")
        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to remove" });
        }

        if (wish) {
            const existingIds = list?.some((p) => p == productId)
            if (!existingIds) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product not in the Wishlist'
                })
            }
            else {
                const newList = list?.filter((f) => f != productId)
                // list.push(productId)
                await wish.update({
                    products: JSON.stringify(newList)
                })
                return res.status(201).json({
                    status: 'success',
                    message: "Removed from Wishlist"
                })
            }
        } else {
            return res.status(400).json({
                status: 'failed',
                message: "No product in the Wishlist",
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting from Wishlist",
            error
        });
    }
};

export const switchToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req?.user?.id
        const wishlist = await Wishlist.findOne({ where:{userId: userId} })
        const cart = await Cart.findOne({ where:{userId: userId} })
        const list = JSON.parse(cart?.products || "[]")
        const wList = JSON.parse(wishlist?.products || "[]")

        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to add" });
        }
        const newList = list.concat([{id:parseInt(productId),quantity:1}])
        const wNewList = wList?.filter((f) => f != productId)
        const existingWish = wList?.some((p) => p == productId)

        if (!existingWish) {
            return res.status(409).json({
                status: 'failed',
                message: 'Product is not in the wishlist'
            })
        }
        // list.push(productId)
        await wishlist.update({
            products: JSON.stringify(wNewList)
        })
        if (cart) {
            const existingIds = list?.some((p) => p?.id == productId)
            if (existingIds) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product already in the Cart'
                })
            }
            // list.push(productId)
            await cart.update({
                products: JSON.stringify(newList)
            })

            return res.status(201).json({
                status: 'success',
                message: "Switched to Cart"
            })
        } else {
            await Cart.create({
                userId: userId,
                products: JSON.stringify(newList)
            })
            return res.status(201).json({
                status: 'success',
                message: "Switched to Cart",
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while switching to Cart",
            error
        });
    }
};