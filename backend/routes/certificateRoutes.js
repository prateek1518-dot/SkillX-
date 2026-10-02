import express from "express";
import {
  getCertificates,
  getCertificateById,
  issueCertificate,
} from "../controllers/certificateController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getCertificates);
router.post("/", protect, issueCertificate);
router.get("/:id", getCertificateById); // Public verification

export default router;
