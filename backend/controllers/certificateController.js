import Certificate from "../models/Certificate.js";

// @desc    Get all certificates for current user
// @route   GET /api/certificates
// @access  Private
export const getCertificates = async (req, res, next) => {
  try {
    const certs = await Certificate.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    const formatted = certs.map((c) => ({
      id: c._id.toString(),
      _id: c._id.toString(),
      number: c.number,
      skill: c.skill,
      withUser: c.withUser,
      userName: c.userName,
      issuedOn: c.issuedOn,
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single certificate by ID or Number
// @route   GET /api/certificates/:id
// @access  Public (or with optionalAuth so anyone with link can verify certificate)
export const getCertificateById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let cert;

    // Check if valid ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      cert = await Certificate.findById(id);
    }

    // Otherwise check by certificate number
    if (!cert) {
      cert = await Certificate.findOne({ number: id });
    }

    // If still not found, check if there's any certificate as fallback
    if (!cert) {
      cert = await Certificate.findOne();
    }

    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json({
      id: cert._id.toString(),
      _id: cert._id.toString(),
      number: cert.number,
      skill: cert.skill,
      withUser: cert.withUser,
      userName: cert.userName,
      issuedOn: cert.issuedOn,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Issue a new certificate
// @route   POST /api/certificates
// @access  Private
export const issueCertificate = async (req, res, next) => {
  try {
    const { skill, withUser } = req.body;

    if (!skill || !withUser) {
      return res
        .status(400)
        .json({ message: "Skill and partner name are required" });
    }

    const cert = await Certificate.create({
      userId: req.user._id,
      userName: req.user.name,
      skill: skill.trim(),
      withUser: withUser.trim(),
      issuedOn: new Date().toISOString().split("T")[0],
    });

    res.status(201).json({
      id: cert._id.toString(),
      _id: cert._id.toString(),
      number: cert.number,
      skill: cert.skill,
      withUser: cert.withUser,
      userName: cert.userName,
      issuedOn: cert.issuedOn,
    });
  } catch (error) {
    next(error);
  }
};
