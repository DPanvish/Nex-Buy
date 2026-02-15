import mongoose from "mongoose";
import addressSchema from "./address.model.js";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    stripeCustomerId: {
        type: String, 
        default: "",
    },
    addresses: [addressSchema],
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    ]
}, { timestamps: true })

export const User = mongoose.model("User", userSchema);