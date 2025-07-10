// backend/controllers/adsController.js

const Ad = require("../models/Ad");

const createAd = async (req, res) => {
  try {
    const { title, description, imageUrl, price, category, city } = req.body;

    const newAd = new Ad({
      title,
      description,
      imageUrl,
      price,
      category,
      city,
      user: req.user.userId, // dolazi iz JWT tokena preko middleware-a
    });

    await newAd.save();
    res.status(201).json({ message: "Oglas uspješno kreiran." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška prilikom kreiranja oglasa." });
  }
};

module.exports = { createAd };
