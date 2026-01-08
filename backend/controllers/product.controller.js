import { Product } from "../models/product.model";

export const getProductById = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
    }catch (error){
        console.error("Error in getProductById:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}