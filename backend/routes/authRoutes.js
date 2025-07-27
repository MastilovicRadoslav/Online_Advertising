const express = require("express");
const router = express.Router(); //Modularni sistem ruta
const { registerUser, loginUser } = require("../controllers/authController");

//Ruta za registraciju
router.post("/register", registerUser);

//Ruta za Login
router.post("/login", loginUser);

module.exports = router;