const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.post("/", passport.authenticate("local"), async (req, res) => {
  const token = await jwt.sign(
    { id: req.user._id },
    process.env.JWT_SECRET, // Ensure this matches in your .env
    { expiresIn: "24h" } // Token expires in 24 hours
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully!",
    token: token,
  });
});

module.exports = router;
