const router = require("express").Router();
const bodyParser = require("body-parser");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    // hashing passsword
    const salt = await bcrypt.genSalt();
    const hashedPassword = bcrypt.hash(req.body.password, salt);
    // create user
    const user = await new User(req.body);
    user.save();
    res.status(200).json({
      message: "User created",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Bad Request",
      error: error,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({
      email: req.body.email,
    });
    const validPassword = bcrypt.compare(req.body.password, user.password);
    if (user && validPassword) {
      res.status(200).json({
        message: "User logged in",
        user: user,
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Bad Request",
      error: error,
    });
  }
});
module.exports = router;
