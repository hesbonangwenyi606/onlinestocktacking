import express from "express";
import { createOrder, getOrder, listMyOrders, listOrders, updateOrderStatus } from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/mine", protect, listMyOrders);
router.get("/", protect, adminOnly, listOrders);
router.get("/:id", protect, getOrder);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
