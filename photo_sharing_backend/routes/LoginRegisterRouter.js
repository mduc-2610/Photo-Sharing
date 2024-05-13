const express = require("express");
const router = express.Router();
const User = require("../db/userModel");

router.post("/login", async (req, res) => {
  const { login_name, password } = req.body;

  try {
    const user = await User.findOne({ login_name });

    if (!user) {
      return res.status(400).json({ error: "Invalid login name or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid login name or password" });
    }
    req.session.user = user;

    res.json({
      _id: user._id,
      login_name: user.login_name,
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ error: "User not logged in" });
  }

  req.session.user = null;
  res.sendStatus(200);
});

const uuid = require("uuid");
router.post("/register", async (req, res) => {
  try {
    const {
      login_name,
      first_name,
      last_name,
      location,
      description,
      occupation,
      password,
    } = req.body;

    const existingUser = await User.findOne({ login_name });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this login name already exists." });
    }
    const newUser = new User({
      login_name,
      first_name,
      last_name,
      location,
      description,
      occupation,
      password,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

module.exports = router;
