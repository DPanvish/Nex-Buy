import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Review } from "../models/review.model.js";

// Create order will be called by the stripe webhook (we dont call it externally)
export const createOrder = async (req, res) => {
    try {
        const user = req.user;
        const {orderItems, shippingAddress, paymentResult, totalPrice} = req.body;

        if(!orderItems || orderItems.length === 0){
            return res.status(400).json({
                success: false,
                message: "No order items"
            });
        }

        // Validate products and stock
        for(const item of orderItems){
            const product = await Product.findById(item.product._id);

            if(!product){
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            if(product.stock < item.capacity){
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock"
                });
            }
        }
        
        const order = await Order.create({
            user: user._id,
            clerkId: user.clerkId,
            orderItems,
            shippingAddress,
            paymentResult,
            totalPrice
        });

        // update product stock
        for(const item of orderItems){
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: {stock: -item.capacity}
            });
        }

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        });
    } catch (error){
        console.error("Error in createOrder:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const user = req.user;
        const orders = await Order.find({user: user._id}).populate("orderItems.product").sort({createdAt: -1});

        const orderIds = orders.map((order) => order._id);
        const reviews = await Review.find({orderId: {$in: orderIds}});
        const reviewedOrderIds = new Set(reviews.map((review) => review.orderId.toString()));

        // check is each order has been reviewed
        const ordersWithReviewStatus = await Promise.all(
            orders.map(async (order) => {
                return {
                    ...order.toObject(),
                    hasReviewed: reviewedOrderIds.has(order._id.toString())
                };
            })
        );

        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders: ordersWithReviewStatus
        });
    } catch (error){
        console.error("Error in getOrder:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}