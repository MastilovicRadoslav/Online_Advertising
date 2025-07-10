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

// GET /api/ads?search=tekst&category=clothing&minPrice=10&maxPrice=1000&mineOnly=true&page=1
const getAds = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            mineOnly,
            page = 1,
        } = req.query;

        const query = {};

        // Filtriranje po nazivu (case - insensitive)
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        // Po kategoriji
        if (category) {
            query.category = category;
        }

        //Po cijeni
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Show min only
        if (mineOnly === "true") {
            query.user = req.user.userId;
        }

        const pageSize = 20;
        const skip = (Number(page) - 1) * pageSize;

        const ads = await Ad.find(query)
            .sort({ createdAd: -1 })
            .skip(skip)
            .limit(pageSize)
            .populate("user", "username phone");
        res.json(ads);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greška prilikom dohvatanja oglasa." });
    }
};

const mongoose = require("mongoose");

const getAdById = async (req, res) => {
    const id = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Neispravan ID oglasa." });
    }

    try {
        const ad = await Ad.findById(id).populate("user", "username phone");

        if (!ad) {
            return res.status(404).json({ message: "Oglas nije pronađen." });
        }

        res.json(ad);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greška prilikom dohvatanja oglasa." });
    }
};


const updateAd = async (req, res) => {
    const id = req.params.id.trim();
    console.log("ID:", JSON.stringify(req.params.id));

    // Validacija ID-ja (da ne baci CastError)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Neispravan ID oglasa." });
    }

    try {
        const ad = await Ad.findById(id);

        if (!ad) {
            return res.status(404).json({ message: "Oglas nije pronađen." });
        }

        // Dozvola: samo vlasnik oglasa može da ga uređuje
        if (ad.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Nemate dozvolu da izmijenite ovaj oglas." });
        }

        // Ažuriranje samo ako postoji nova vrijednost
        const { title, description, imageUrl, price, category, city } = req.body;

        if (title !== undefined) ad.title = title;
        if (description !== undefined) ad.description = description;
        if (imageUrl !== undefined) ad.imageUrl = imageUrl;
        if (price !== undefined) ad.price = price;
        if (category !== undefined) ad.category = category;
        if (city !== undefined) ad.city = city;

        await ad.save();

        res.json({ message: "Oglas je uspješno izmijenjen." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greška prilikom izmjene oglasa." });
    }
};

const deleteAd = async (req, res) => {
    const id = req.params.id.trim();
    console.log("ID:", JSON.stringify(req.params.id));

    // Validacija ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Neispravan ID oglasa." });
    }

    try {
        const ad = await Ad.findById(id);

        if (!ad) {
            return res.status(404).json({ message: "Oglas nije pronađen." });
        }

        // Samo vlasnik može obrisati oglas
        if (ad.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Nemate dozvolu da obrišete ovaj oglas." });
        }

        await Ad.deleteOne({ _id: id }); // sigurniji od ad.remove()

        res.json({ message: "Oglas uspješno obrisan." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greška prilikom brisanja oglasa." });
    }
};

module.exports = {
    getAds,
    createAd,
    getAdById,
    updateAd,
    deleteAd
};
