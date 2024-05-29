const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const verifyToken = require("./authMiddleware");

router.get("/list",verifyToken, async (request, response) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    response.json(users);
  } catch (e) {
    console.error(e);
  }
});

router.get("/:id",verifyToken, async (req, res) => {
  const id = req.params.id;
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  try {
    const user = await User.findById(id);
    if (user) {
      const { _id, first_name, last_name, location, description, occupation } =
        user;
      const detailedUser = {
        _id,
        first_name,
        last_name,
        location,
        description,
        occupation,
      };
      res.json(detailedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
