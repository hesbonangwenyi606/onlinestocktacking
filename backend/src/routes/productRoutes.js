import express from "express";
import {
  addReview,
  createProduct,
  deleteProduct,
  getProduct,
  getSuggestions,
  listProducts,
  updateProduct
} from "../controllers/productController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", listProducts);
router.get("/suggestions", getSuggestions);
router.get("/:id", getProduct);
router.post("/", protect, adminOnly, upload.array("images", 6), createProduct);
router.put("/:id", protect, adminOnly, upload.array("images", 6), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.post("/:id/reviews", protect, addReview);

export default router;
