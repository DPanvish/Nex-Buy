import { User } from "../models/user.model.js";

export const addAddress = async (req, res) => {
    try {
        const { label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault } = req.body;
        
        const user = req.user;

        // if this is set as default, then unset all other address defaults
        if(isDefault) {
            user.addresses.forEach((address) => {
                address.isDefault = false;
            });
        }

        user.addresses.push({
            label,
            fullName,
            streetAddress,
            city,
            state,
            zipCode,
            phoneNumber,
            isDefault
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "Address added successfully",
            addresses: user.addresses
        });
    }catch (error) {
        console.error("Error in addAddress:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const getAddresses = async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({
            success: true,
            message: "Addresses fetched successfully",
            addresses: user.addresses
        });
    }catch (error) {
        console.error("Error in getAddress:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const updateAddress = async (req, res) => {
    try {
        const { label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault } = req.body;
        const { addressId } = req.params;
        const user = req.user;
        const address = user.addresses.id(addressId);

        if(!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        if(isDefault) {
            user.addresses.forEach((address) => {
                address.isDefault = false;
            });
        }

        address.label = label || address.label;
        address.fullName = fullName || address.fullName;
        address.streetAddress = streetAddress || address.streetAddress;
        address.city = city || address.city;
        address.state = state || address.state;
        address.zipCode = zipCode || address.zipCode;
        address.phoneNumber = phoneNumber || address.phoneNumber;
        address.isDefault = isDefault || address.isDefault;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            addresses: user.addresses
        });
    }catch (error) {
        console.error("Error in updateAddress:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const user = req.user;
        const { addressId } = req.params;

        user.addresses.pull(addressId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            addresses: user.addresses
        });
    }catch (error) {
        console.error("Error in deleteAddress:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        
        // If the product is already in the wishlist
        if(user.whistlist.includes(productId)) {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist"
            });
        }

        user.whistlist.push(productId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            wishlist: user.wishlist
        });
    }catch (error) {
        console.error("Error in addToWishlist:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        }); 
    }
}

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = req.user;

        // If the product is not in wishlist
        if(!user.whistlist.includes(productId)){
            res.status(400).json({
                success: false,
                message: "Product not in wishlist"
            });
        }

        user.whistlist.pull(productId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            wishlist: user.wishlist
        });
    }catch(error) {
        console.error("Error in removeFromWishlist:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        }); 
    }
}

export const getWishlist = async (req, res) => {
    try {
        const user = req.user;

        res.stause(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            wishlist: user.wishlist
        });
    }catch(error) {
        console.error("Error in getWishlist:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        }); 
    }
}