const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//username, password, phone
const registerUser = async (req, res) => {
  try {
    const { username, password, phone } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      phone,
    });

    await newUser.save(); // Čuvam u bazi

    res.status(201).json({ message: "Successful registration." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration error.", error: err.message });
  }
};

//username, password
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "There is no user." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password." });
    }

    //Generisanje tokena (zaštita ruta)
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, username: user.username, userId: user._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error." });
  }
};


module.exports = { registerUser, loginUser };