import express from "express";
import {
  getRequests,
  createRequest,
  updateRequestStatus,
} from "../controllers/requestController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // All request routes are protected

router.route("/").get(getRequests).post(createRequest);
router.route("/:id").patch(updateRequestStatus).put(updateRequestStatus);

export default router;
