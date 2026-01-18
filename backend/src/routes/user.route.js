import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addAddress, getAddresses, updateAddress, deleteAddress, addToWishlist, removeFromWishlist, getWishlist } from "../controllers/user.controller.js";

const router = Router();

router.use(protectRoute);

// Address Routes
router.post("/addresses", addAddress);
router.get("/addresses", getAddresses);
router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);

// Wishlist Routes
router.post("/wishlist", addToWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);
router.get("/wishlist", getWishlist);

export default router;