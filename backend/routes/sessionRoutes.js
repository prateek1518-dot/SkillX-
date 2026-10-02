import express from "express";
import {
  getSessions,
  createSession,
  updateSession,
} from "../controllers/sessionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // All session routes are protected

router.route("/").get(getSessions).post(createSession);
router.route("/:id").patch(updateSession).put(updateSession);

export default router;
