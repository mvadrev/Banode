const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User"); // Adjust the path as necessary

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email });

  User.register(user, password, (err, user) => {
    if (err) {
      console.error(err); // Log to console for debugging
      return res.status(500).json({
        success: false,
        message: "Failed to register user.",
        err: err.message,
      });
    }
    passport.authenticate("local")(req, res, () => {
      res
        .status(200)
        .json({ success: true, message: "Registration successful!" });
    });
  });
});

module.exports = router;
