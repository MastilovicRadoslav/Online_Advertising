const express = require("express");
const router = express.Router();

const { createAd, getAds, getAdById, updateAd, deleteAd } = require("../controllers/adsController");
const authMiddleware = require("../middleware/authMiddleware");

// Zaštićena ruta
router.post("/", authMiddleware, createAd);
router.get("/", getAds); // Ođe mi ne treba zaštita jer prikazujem i neregistorvanim
router.get("/:id", getAdById); // Ođe mi ne treba zaštita jer prikazujem i neregistorvanim
router.put("/:id", authMiddleware, updateAd);
router.delete("/:id", authMiddleware, deleteAd);




module.exports = router;
