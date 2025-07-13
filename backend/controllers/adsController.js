const Ad = require("../models/Ad");

const createAd = async (req, res) => {
  try {
    const { title, description, price, category, city } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const newAd = new Ad({
      title,
      description,
      imageUrl: imagePath,
      price,
      category,
      city,
      user: req.user.userId,
    });

    await newAd.save();
    res.status(201).json({ message: "Ad created successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while creating ad." });
  }
}

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
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(pageSize)
            .populate("user", "username phone");

        const total = await Ad.countDocuments(query); // ← dodaj ovo

        res.json({
            ads,
            total, // ← i ovo
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching ad." });
    }
};

const mongoose = require("mongoose");

const getAdById = async (req, res) => {
    const id = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ad ID." });
    }

    try {
        const ad = await Ad.findById(id).populate("user", "username phone");

        if (!ad) {
            return res.status(404).json({ message: "Ad not found." });
        }

        res.json(ad);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching ad" });
    }
};


const updateAd = async (req, res) => {
  const id = req.params.id.trim();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ad ID." });
  }

  try {
    const ad = await Ad.findById(id);

    if (!ad) {
      return res.status(404).json({ message: "Ad not found." });
    }

    if (ad.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this ad." });
    }

    const { title, description, price, category, city } = req.body;

    if (title !== undefined) ad.title = title;
    if (description !== undefined) ad.description = description;
    if (price !== undefined) ad.price = price;
    if (category !== undefined) ad.category = category;
    if (city !== undefined) ad.city = city;

    if (req.file) {
      ad.imageUrl = `/uploads/${req.file.filename}`;
    }

    await ad.save();
    res.json({ message: "Ad updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while updating ad." });
  }
};


const deleteAd = async (req, res) => {
    const id = req.params.id.trim();
    console.log("ID:", JSON.stringify(req.params.id));

    // Validacija ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ad ID." });
    }

    try {
        const ad = await Ad.findById(id);

        if (!ad) {
            return res.status(404).json({ message: "Ad not found." });
        }

        // Samo vlasnik može obrisati oglas
        if (ad.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You do not have permission to delete this ad." });
        }

        await Ad.deleteOne({ _id: id }); // sigurniji od ad.remove()

        res.json({ message: "Ad successfully deleted." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting ad." });
    }
};

module.exports = {
    getAds,
    createAd,
    getAdById,
    updateAd,
    deleteAd
};
