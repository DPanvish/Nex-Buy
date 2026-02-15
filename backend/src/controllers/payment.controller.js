import Stripe from "stripe";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

export const createPaymentIntent = async(req, res) => {
    try{
        const { cartItems, shippingAddress } = req.body;
        const user = req.user;

        if(!cartItems || cartItems.length === 0){
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        let subtotal = 0;
        const validatedItems = [];

        for(const item of cartItems){
            const product = await Product.findById(item.product._id);
            if(!product){
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.product.name} not found`
                });
            }

            if(product.stock < item.quantity){
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.product.name}`
                });
            }

            subtotal += product.price * item.quantity;
            validatedItems.push({
                product: product._id.toString(),
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images[0],
            })
        }

        const shipping = 10.0;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        if(total <= 0){
            return res.status(400).json({
                success: false,
                message: "Invalid order total"
            });
        }

        // Find or create stripe customer

        let customer;
        if(user.stripeCustomerId){
            customer = await stripe.customers.retrieve(user.stripeCustomerId);
        }else{
            customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    clerkId: user.clerkId,
                    userId: user._id.toString(),
                },
            });

            await User.findByIdAndUpdate(user._id, {
                stripeCustomerId: customer.id
            });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: "usd",
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true
            },
            metadata: {
                clerkId: user.clerkId,
                userId: user._id.toString(),
                orderItems: JSON.stringify(validatedItems),
                shippingAddress: JSON.stringify(shippingAddress),
                totalPrice: total.toFixed(2)
            },
            // In the webhooks ection we will use this metadata
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });
    }catch(error){
        console.error("Error in createPaymentIntent:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create payment intent"
        });
    }
};