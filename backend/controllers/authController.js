const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, password, phone } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Korisničko ime je zauzeto." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      phone,
    });

    await newUser.save();

    res.status(201).json({ message: "Uspješna registracija." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri registraciji.", error: err.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Pogrešno korisničko ime ili šifra." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Pogrešno korisničko ime ili šifra." });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, username: user.username, userId: user._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri loginu." });
  }
};


module.exports = { registerUser, loginUser };