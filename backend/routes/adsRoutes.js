const express = require("express");
const router = express.Router();

const {
  createAd,
  getAds,
  getAdById,
  updateAd,
  deleteAd,
} = require("../controllers/adsController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const optionalAuth = require("../middleware/optionalAuthMiddleware");


// GET-ovi ne traže login
router.get("/", optionalAuth, getAds); 
router.get("/:id", getAdById);

// Zaštićene rute za CRUD + upload slike
router.post("/", authMiddleware, upload.single("image"), createAd);
router.put("/:id", authMiddleware, upload.single("image"), updateAd);
router.delete("/:id", authMiddleware, deleteAd);

module.exports = router;
