import cloudinary from "cloudinary";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";



export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        if(!name || !description || !price || !stock || !category){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if(!req.files || req.files,length === 0){
            return res.status(400).json({
                success: false,
                message: "At least one image is required"
            }) ;
        }

        if(req.files.length > 3){
            return res.status(400).json({
                success: false,
                message: "Maximum of 3 images are allowed"
            });
        }

        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products"
            });
        });

        const uploadImages = await Promise.all(uploadPromises);

        // secure url
        const imageUrls = uploadImages.map((image) => image.secure_url);

        const product = new Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            images: imageUrls
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });
    }catch (error) {
        console.error("Error in createProduct:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const getAllProducts = async (_, res) => {
    try {
        const products = (await Product.find()).toSorted({createdAt: -1});
        res.status(200).json({
            success: true,
            products
        });
    }catch (error) {
        console.error("Error in getAllProducts:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category } = req.body;

        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if(name){
            product.name = name;
        }
        if(description){
            product.description = description;
        }
        if(price){
            product.price = parseFloat(price);
        }
        if(stock !== undefined){
            product.stock = parseInt(stock);
        }
        if(category){
            product.category = category;
        }

        // Image updates
        if(req.files && req.files.length > 0){
            if(req.files.length > 3){
                return res.status(400).json({
                    success: false,
                    message: "Maximum of 3 images are allowed"
                });
            }

            const uploadPromises = req.files.map((file) => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "products"
                })
            })
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    }catch (error) {
        console.error("Error in updateProduct:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const getAllOrders = async (_, res) => {
    try {
        const orders = (await Order.find().populate("user", "name email").populate("orderItems.product")).toSorted({createdAt: -1});
        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders
        });
    }catch (error) {
        console.error("Error in getAllOrders:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if(!["pending", "shipped", "delivered"].includes(status)){
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = status;
        
        if(status === "shipped" && !order.shippedAt){
            order.shippedAt = new Date();
        }

        if(status === "delivered" && !order.deliveredAt){
            order.deliveredAt = new Date();
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    }catch (error) {
        console.error("Error in updateOrderStatus:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const getAllCustomers = async (_, res) => {
    try {
        const customers = await User.find().sort({createdAt: -1});
        res.status(200).json({
            success: true,
            message: "Customers fetched successfully",
            customers
        });
    }catch (error) {
        console.error("Error in getAllCustomers:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const getDashboardStats = async (_, res) => {
    try {
        const totalOrders = await Order.countDocuments();

        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalPrice" }
                }
            }
        ]);

        const totalRevenue = revenueResult[0]?.total || 0;
        const totalCustomers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        res.status(200).json({
            success: true,
            stats: {
                totalOrders,
                totalRevenue,
                totalCustomers,
                totalProducts
            }
        });
    }catch (error) {
        console.error("Error in getDashboardStats:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}