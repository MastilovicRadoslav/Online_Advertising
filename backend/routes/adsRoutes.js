const express = require("express");
const router = express.Router();

const { createAd } = require("../controllers/adsController");
const authMiddleware = require("../middleware/authMiddleware");

// Zaštićena ruta
router.post("/", authMiddleware, createAd);

module.exports = router;
