const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

//Ruta za registraciju
router.post("/register", registerUser);

//Ruta za Login
router.post("/login", loginUser);

module.exports = router;