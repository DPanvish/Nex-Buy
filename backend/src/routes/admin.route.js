import { Router } from "express";
import { createProduct, getAllProducts, updateProduct, getAllOrders, updateOrderStatus, getAllCustomers, getDashboardStats, deleteProduct } from "../controllers/admin.controller.js";
import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";




const router = Router();

router.use(protectRoute, adminOnly);

router.post("/products", upload.array("images", 3), createProduct);
router.get("/products", getAllProducts);

// PUT: Used for full resource replacement, updating the entire resource
router.put("/products/:id", upload.array("images", 3), updateProduct);
router.get("/orders", getAllOrders);
router.delete("/products/:id", deleteProduct);

// PATCH: Used for partial resource updates, updating a specific part of the resource
router.patch("/orders/:orderId/status", updateOrderStatus);

router.get("/customers", getAllCustomers);
router.get("/stats", getDashboardStats);

export default router
