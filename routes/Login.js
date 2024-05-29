const express = require("express");
const User = require("../db/userModel");
const jwt = require("jsonwebtoken");
const router = express.Router();
const verifyToken = require("./authMiddleware");

const secretKey = "Tung2003August!ten";

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ user_name: username, password: password });
  if (!user) res.status(404).send("User not found");
  jwt.sign({ user }, secretKey, { expiresIn: "1h" }, (err, token) => {
    if (err) {
      res.status(500).send("Error generating token");
    } else {
      res.json({ token });
    }
  });
});

router.post("/register", async (req, res) => {
  const {
    user_name,
    first_name,
    last_name,
    occupation,
    description,
    location,
    password,
  } = req.body;
  const exitedUser = await User.findOne({ user_name });
  if (exitedUser) {
    return res.status(400).json({ message: "User name exited" });
  }

  const newUser = new User({
    user_name,
    first_name,
    last_name,
    occupation,
    description,
    location,
    password,
  });
  try {
    await newUser.save();
    res
      .status(201)
      .json({ message: "Successfull to create an account!", user: newUser });
  } catch (error) {
    console.error("Error to register:", error);
    res.status(500).json({ message: "Failed to create new account" });
  }
});

router.get("/profile", verifyToken, async (req, res) => {
  const user = req.user;
  res.json(user);
});

module.exports = router;
