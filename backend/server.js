const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config(); //korišćenje varijabli iz .env

const app = express(); //osnovni web framework

// omogućava konekcije sa frontend domena (localhost:5173)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

//osnovna sigurnost HTTP zaglavlja, i omogućavanje učitavanja slika iz /uploads
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

//parsitanje podataka iz body
app.use(express.json());

// ovo omogućava React aplikaciji da vidi slike iz foldera uploads kao http://localhost:5000/uploads/naziv.jpg.
// ručno postavljanje MIME tipa (Content-Type) osigurava da browser zna da je u pitanju slika.
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
      res.setHeader("Content-Type", "image/jpeg");
    } else if (filePath.endsWith(".png")) {
      res.setHeader("Content-Type", "image/png");
    }
  }
}));

// rute
const authRoutes = require("./routes/authRoutes");
const adsRoutes = require("./routes/adsRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/ads", adsRoutes);

// konekcija
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("DB connection error:", err.message));
