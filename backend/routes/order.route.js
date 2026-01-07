import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { createOrder, getOrders } from "../controllers/order.controller.js";

const router = Router();

router.post("/", protectRoute, createOrder);
router.get("/", protectRoute, getOrders);

export default router;