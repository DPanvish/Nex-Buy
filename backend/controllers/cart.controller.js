import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export const getCart = async (req, res) => {
    try {
        const user = req.user;
        let cart = await Cart.findOne({clerkId: user.clerkId}).populate("items.product");

        if(!cart){
            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cart
        });
    }catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const addToCart = async (req, res) => {
    try {
        const user = req.user;
        const { productId, quantity = 1 } = req.body;
        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if(product.stock < quantity){
            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });
        }

        let cart = await Cart.findOne({clerkId: user.clerkId});

        if(!cart){
            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: [],
            });
        }

        // check if item is in the cart
        const existingItem = cart.items.find((item) => item.product.toString() === productId.toString());
        if(existingItem){
            if(product.stock < existingItem.quantity + quantity){
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock"
                });
            }

            existingItem.quantity += quantity;
        }else{
            cart.items.push({
                product: productId,
                quantity
            });
        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            cart
        });
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const updateCartItem = async (req, res) => {
    try {
        const user = req.user;
        const { productId } = req.params;
        const { quantity } = req.body;

        if(quantity < 1){
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0"
            });
        }

        const cart = await Cart.findOne({clerkId: user.clerkId});
        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }

        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId.toString());
        if(itemIndex === -1){
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if(product.stock < quantity){
            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item updated successfully",
            cart
        });
    }catch (error) {
        console.error("Error in updateCartItem:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const user = req.user;
        const { productId } = req.params;
        const cart = await Cart.findOne({clerkId: user.clerkId});
        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== productId.toString());
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart
        });
    }catch (error) {
        console.error("Error in removeFromCart:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const clearCart = async (req, res) => {
    try {
        const user = req.user;
        const cart = await Cart.findOne({clerkId: user.clerkId});
        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart
        });
    }catch (error) {
        console.error("Error in clearCart:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}