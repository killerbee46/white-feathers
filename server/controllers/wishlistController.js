import { sequelize } from "../config/tempDb.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import { sqlProductFetch } from "../utils/sqlProductFetch.js";

export const getWishlist = async (req, res) => {
    try {
        const userId = req?.user?._id
        const wishlist = await Wishlist.findOne({ userId: userId }, 'products')
        return res.status(200).json({
            status: 'success',
            message: "Wishlist fetched successfully",
            data: wishlist?.products || []
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
        const userId = req?.user?._id
        const wishlist = await Wishlist.findOne({ userId: userId })
        req.body.userId = userId
        let list = []

        const query = sqlProductFetch("p.p_name as title,")+` and p.id_pack = ${productId} `
        const [data] = await sequelize.query(query)
        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to add" });
        }

        if (wishlist) {
            list = wishlist?.products
            const existingIds = wishlist.products?.map((p)=> p.id )
            if (existingIds.includes(parseInt(productId))) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product already in the wishlist'
                })
            }
            // list.push(productId)
            const wish = await Wishlist.findByIdAndUpdate(wishlist?._id, {
                $push: { products: data[0] }
            })
            return res.status(201).json({
                status: 'success',
                message: "Added to wishlist"
            })
        } else {
            list.push(data[0])
            const wish = new Wishlist({
                userId: userId,
                products: list
            }).save()
            return res.status(201).json({
                status: 'success',
                message: "Added to wishlist",
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while adding to wishlist",
            error
        });
    }
};

export const removeWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req?.user?._id
        const wishlist = await Wishlist.findOne({ userId: userId })
        req.body.userId = userId
        let list = []
        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to remove" });
        }

        if (wishlist) {
            list = wishlist?.products

            const newList = list?.filter((f)=> f.id != productId)

            const existingIds = wishlist.products?.map((p)=> p.id )
            if (!existingIds.includes(parseInt(productId))) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product is not in the wishlist'
                })
            }
            // list.push(productId)
            const wish = await Wishlist.findByIdAndUpdate(wishlist?._id, {
                products:newList
            })
            return res.status(201).json({
                status: 'success',
                message: "Removed from wishlist"
            })
        } else {
            return res.status(400).json({
                status: 'failed',
                message: "No product in the wishlist",
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while adding to wishlist",
            error
        });
    }
};

export const switchToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req?.user?._id
        const wishlist = await Wishlist.findOne({ userId: userId })
        const cart = await Cart.findOne({ userId: userId })
        req.body.userId = userId
        let list = []

        const query = sqlProductFetch("p.p_name as title,")+` and p.id_pack = ${productId} `
        const [data] = await sequelize.query(query)
        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to add" });
        }
list = wishlist?.products

            const newList = list?.filter((f)=> f.id != productId)

            const existingWishlist = wishlist?.products?.map((p)=> p.id )
            if (!existingWishlist.includes(parseInt(productId))) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product is not in the wishlist'
                })
            }
            // list.push(productId)
            const wish = await Wishlist.findByIdAndUpdate(wishlist?._id, {
                products:newList
            })
        if (cart) {
            list = cart?.products
            const existingIds = cart.products?.map((p)=> p?.id )
            if (existingIds.includes(parseInt(productId))) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product already in the Cart'
                })
            }
            // list.push(productId)
            const cartCreate = await Cart.findByIdAndUpdate(cart?._id, {
                $push: { products: {...data[0], quantity:1} }
            })

            

            return res.status(201).json({
                status: 'success',
                message: "Switched to Cart"
            })
        } else {
            list.push({...data[0], quantity:1})
            const cart = new Cart({
                userId: userId,
                products: list
            }).save()
            return res.status(201).json({
                status: 'success',
                message: "Switched to Cart",
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