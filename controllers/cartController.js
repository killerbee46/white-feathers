import { sequelize } from "../config/tempDb.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import { sqlProductFetch } from "../utils/sqlProductFetch.js";

export const getCart = async (req, res) => {
    try {
        const userId = req?.user?._id
        const cart = await Cart.findOne({ userId: userId }, 'products')
        let finalPrice = 0
        let discount = 0
        cart?.products?.map((p)=> {
            finalPrice += (p?.dynamic_price * p?.quantity)
            discount += (p?.discount * p?.quantity)
        })
        return res.status(200).json({
            status: 'success',
            message: "Cart fetched successfully",
            data: {
                products:cart?.products,
                totalPrice:(finalPrice+discount).toFixed(2),
                discount:discount.toFixed(2),
                finalPrice:finalPrice.toFixed(2)
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
        const userId = req?.user?._id
        const cart = await Cart.findOne({ userId: userId })
        const wishlist = await Wishlist.findOne({ userId: userId })
        req.body.userId = userId
        let list = []

        const query = sqlProductFetch("p.p_name as title,")+` and p.id_pack = ${productId} `
        const [data] = await sequelize.query(query)
        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to add" });
        }
        if(wishlist){
            const existingWishlist = wishlist?.products?.map((p)=> p?.id )
            if (existingWishlist.includes(parseInt(productId))) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product is in the wishlist'
                })
            }
        }

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
            const wish = await Cart.findByIdAndUpdate(cart?._id, {
                $push: { products: {...data[0], quantity:1} }
            })
            return res.status(201).json({
                status: 'success',
                message: "Added to Cart"
            })
        } else {
            list.push({...data[0], quantity:1})
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

export const updateCart = async (req, res) => {
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

            const newList = list?.filter((f)=> f.id != productId)

            const existingIds = cart.products?.map((p)=> p.id )
            if (!existingIds.includes(parseInt(productId))) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product is not in the Cart'
                })
            }
            // list.push(productId)
            const wish = await Cart.findByIdAndUpdate(cart?._id, {
                products:newList
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
            message: "Error while switching to Cart",
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

        const query = sqlProductFetch("p.p_name as title,")+` and p.id_pack = ${productId} `
        const [data] = await sequelize.query(query)
        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to add" });
        }
list = cart?.products

            const newList = list?.filter((f)=> f.id != productId)

            const existingCart = cart?.products?.map((p)=> p.id )
            if (!existingCart.includes(parseInt(productId))) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product is not in the cart'
                })
            }
            // list.push(productId)
            const wish = await Cart.findByIdAndUpdate(cart?._id, {
                products:newList
            })
        if (wishlist) {
            list = wishlist?.products
            const existingIds = wishlist.products?.map((p)=> p?.id )
            if (existingIds.includes(parseInt(productId))) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product already in the Wishlist'
                })
            }
            // list.push(productId)
            const wishlistCreate = await Wishlist.findByIdAndUpdate(wishlist?._id, {
                $push: { products: {...data[0]} }
            })

            

            return res.status(201).json({
                status: 'success',
                message: "Switched to Wishlist"
            })
        } else {
            list.push({...data[0]})
            const wish = new wishlist({
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