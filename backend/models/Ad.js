const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
    title: {type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    price: { type: Number },
    category: {
        type: String,
        enum: [ 
            "clothing", "tools", "sports", "accessories", "furniture",
            "pets", "games", "books", "technology"
        ],
        required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    city: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ad", adSchema);
