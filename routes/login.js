const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.post("/", passport.authenticate("local"), (req, res) => {
  // Create a token
  const token = jwt.sign(
    { id: req.user._id },
    process.env.JWT_SECRET || "your_secret_key", // Use an environment variable for the secret key
    { expiresIn: "24h" } // Token expires in 24 hours
  );

  // Send the token to the client
  res.status(200).json({
    success: true,
    message: "Logged in successfully!",
    token: token,
  });
});

module.exports = router;
