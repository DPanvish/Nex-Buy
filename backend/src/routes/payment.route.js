import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";

const router = Router();

router.post("/create-intent", protectRoute, createPaymentIntent);

export default router;