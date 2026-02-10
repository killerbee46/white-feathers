import Review from "../models/Review.js";
import User from "../models/User.js";

export const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Review.findAll({where:{ type: "testimonial" }})
        const userId = req?.user?.id
        let allowActions = false
        const newTestimonial = testimonials.map((test) => {
            if (userId) {
                allowActions = test.userId == userId
            }
            return {
                ...test?.dataValues,
                allowActions: allowActions
            }
        })

        return res.status(200).json({
            status: 'success',
            message: "Reviews fetched successfully",
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

export const getMyReviews = async (req, res) => {
    try {
        const userId = req?.user?.id
        const testimonials = await Review.findAll({where:{userId:userId},attributes:["review", "rating", "createdAt", "updatedAt", "productId", "type"]})
        const newTestimonial = testimonials.map((test) => {
            return {
                ...test?.dataValues,
                allowActions: true
            }
        })

        return res.status(200).json({
            status: 'success',
            message: "Reviews fetched successfully",
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

export const getProductReview = async (req, res) => {
    try {
        const { productId } = req?.params
        const testimonials = await Review.findAll({where:{ type: "product", productId: productId },
        include:[
            { model: User, required: true, attributes:["name","email"] }
        ]
        })
        const userId = req?.user?.id
        let allowActions = true
        const newTestimonial = testimonials.map((test) => {
            if (userId) {
                allowActions = test.userId !== userId
            }
            return {
                ...test?.dataValues,
                allowActions: allowActions
            }
        })

        return res.status(200).json({
            status: 'success',
            message: "Product reviews fetched successfully",
            data: newTestimonial
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while fetching product review",
        });
    }
};


export const addReview = async (req, res) => {
    try {
        const { rating, review, productId } = req.body
        const userId = req?.user?.id
        req.body.userId = userId
        const reviewFilter = productId ? { type: "product", productId: productId } : { type: "testimonial" }
        const myReview = await Review.findOne({where:{ userId: userId, ...reviewFilter } , attributes:["id"]})
        //validations
        if (!rating && !review) {
            return res.status(400).send({ error: "Both rating and review are required" });
        }
        if (myReview) {
            return res.status(400).send({ error: "You have already added your review" });
        }
        if (productId) {
            req.body.type = "product"
            req.body.productId = productId
        } else {
            req.body.type = "testimonial"
        }

        const newReview = await Review.create(req?.body)
        return res.status(201).json({
            status: 'success',
            message: "Review added successfully!",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Error while adding to Reviews",
            error
        });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, review } = req?.body
        const userId = req?.user?.id
         const myReview = await Review.findByPk(id)

        //validations
        if (!myReview) {
            return res.send({ error: "You have no review" });
        }
        if (!rating && !review) {
            return res.status(400).send({ error: "Both rating and review are required" });
        }
        if (userId !== myReview.userId) {
            return res.send({ error: "You have no permission to edit this review" });
        }
        myReview.update({
            ...req.body
        })
        return res.status(201).json({
            status: "success",
            message: "Review updated successfully."
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

export const removeReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req?.user?.id
        const myReview = await Review.findByPk(id,{attributes:['id',"userId"]})

        //validations
        if (!myReview) {
            return res.send({ error: "You have no review" });
        }
        if (userId !== myReview.userId) {
            return res.send({ error: "You have no permission to delete this review" });
        }
        const deleted = await myReview.destroy()
        return res.status(201).json({
            status: "success",
            message: "Review deleted successfully."
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