import Review from "../models/Review.js";

export const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Review.find({ type: "testimonial" }, "userId rating review created_at type")
        const userId = req?.user?._id
        let allowActions = true
        const newTestimonial = testimonials.map((test) => {
            if (userId) {
                allowActions = test.userId !== userId
            }
            return {
                ...test._doc,
                allowActions: allowActions
            }
        })

        return res.status(200).json({
            status: 'success',
            message: "Testimonials fetched successfully",
            data: newTestimonial
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting testimonials",
        });
    }
};


export const addReview = async (req, res) => {
    try {
        const { rating, review, productId } = req.body
        const userId = req?.user?._id
        req.body.userId = userId
        const myReview = await Review.findOne({ userId: userId, type: productId ? "product" : "testimonial" }, "")
        //validations
        if (!rating && !review) {
            return res.status(400).send({ error: "Both rating and review are required" });
        }
        if (myReview) {
            return res.status(400).send({ error: "You have already added your review" });
        }
        if (productId) {
            req.body.type = "product"
            req.body.productId = "productId"
        } else {
            req.body.type = "testimonial"
        }

        const newReview = new Review({
            ...req?.body
        }).save()
        return res.status(201).json({
            status: 'success',
            message: "Review added successfully!",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Error while adding to Cart",
            error
        });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req?.body
        const userId = req?.user?._id
        const cart = await Review.findOne({ userId: userId })
        req.body.userId = userId
        let list = []
        //validations
        if (!productId) {
            return res.send({ error: "Please select a product to remove" });
        }

        if (cart) {
            list = cart?.products

            const updatedList = list.map((l) => {
                if (l.id_pack == productId) {
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

export const removeReview = async (req, res) => {
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

            const newList = list?.filter((f) => f.id_pack != productId)

            const existingIds = cart.products?.map((p) => p.id_pack)
            if (!existingIds.includes(parseInt(productId))) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Product is not in the Cart'
                })
            }
            // list.push(productId)
            const wish = await Cart.findByIdAndUpdate(Cart?._id, {
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