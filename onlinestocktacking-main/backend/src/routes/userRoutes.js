import express from "express";
import {
  addAddress,
  deleteAddress,
  deleteUser,
  getUser,
  listAddresses,
  listUsers,
  updateProfile,
  updateUser
} from "../controllers/userController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me/addresses", protect, listAddresses);
router.post("/me/addresses", protect, addAddress);
router.delete("/me/addresses/:id", protect, deleteAddress);
router.put("/me", protect, updateProfile);

router.get("/", protect, adminOnly, listUsers);
router.get("/:id", protect, adminOnly, getUser);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
