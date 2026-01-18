import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000,
    },
    title: {
        type: String,
        maxlength: 100,
    }
}, {timestamps: true});

// User can review a product only once
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);