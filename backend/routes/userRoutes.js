import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  addSkill,
  removeSkill,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/skills", protect, addSkill);
router.delete("/skills", protect, removeSkill);

export default router;
