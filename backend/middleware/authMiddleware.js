const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Provjera da li postoji token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Niste autorizovani." });
    }

    const token = authHeader.split(" ")[1];

    try{
        //Verifikuj token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; //dodaj korisnika u request objekat
        next(); //moram pozvati da mi Express nastavio dalje
    } catch (err) {
        return res.status(401).json({ message: "Nesipravan token." });
    }
};

module.exports = authMiddleware;
