import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export const createReview = async (req, res) => {
    try {
        const { productId, orderId, rating } = req.body;

        if(!productId || !orderId){
            return res.status(400).json({
                success: false,
                message: "Product ID and Order ID are required"
            });
        }

        if(!rating || rating < 1 || rating > 5){
            return res.status(400).json({
                success: false,
                message: "Invalid rating"
            });
        }

        const user = req.user;
        const order = await Order.findById(orderId);

        if(!order){
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if(order.clerkId !== user.clerkId){
            return res.status(403).json({
                success: false,
                message: "Unauthorized to review this order"
            });
        }

        if(order.status !== "delivered"){
            return res.status(400).json({
                success: false,
                message: "Can only review delivered orders"
            });
        }

        const productInOrder = order.orderItems.find(
            (item) => item.product.toString() === productId.toString()
        );
        if(!productInOrder){
            return res.status(404).json({
                success: false,
                message: "Product not found in order"
            });
        }
        
        let review;

        const existingReview = await Review.findOne({ productId, userId: user._id });
        if(existingReview){
            // Update the existing review
            existingReview.rating = rating;
            existingReview.orderId = orderId;
            review = await existingReview.save();
        }else{
            // create new review
            review = await Review.create({
                productId,
                orderId,
                userId: user._id,
                rating
            });
        }

        // update this product rating
        const reviews = await Review.find({ productId });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                averageRating: totalRating / reviews.length,
                totalReviews: reviews.length
            },
            {
                new: true,
                runValidators: true
            }
        );

        if(!updatedProduct){
            await Review.findByIdAndDelete(review._id);
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        res.status(201).json({
            success: true,
            message: "Review created successfully",
            review
        });
    }catch (error) {
        console.error("Error in createReview:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const user = req.user;

        const review = await Review.findById(reviewId);

        if(!review){
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        if(review.userId.toString() !== user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this review"
            });
        }

        const productId = review.productId;
        await Review.findByIdAndDelete(reviewId);

        const reviews = await Review.find({ productId });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        await Product.findByIdAndUpdate(productId, {
            averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
            totalReviews: reviews.length
        });

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    }catch (error) {
        console.error("Error in deleteReview:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}