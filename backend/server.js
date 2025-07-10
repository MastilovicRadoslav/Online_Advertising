const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const app = express(); 

app.use(cors());
app.use(helmet());
app.use(express.json()); // Omogućava da Express čita JSON telo

// Uvoz ruta
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Test ruta
app.get("/", (req, res) => {
  res.send("API radi!");
});

// Povezivanje na bazu
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server radi na portu ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("Greška sa bazom:", err.message));
