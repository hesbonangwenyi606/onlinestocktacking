import express from "express";
import { capturePayPalOrder, createPayPalOrder } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/paypal/create-order", protect, createPayPalOrder);
router.post("/paypal/capture-order", protect, capturePayPalOrder);

export default router;
