const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User"); // Adjust the path as necessary

// Define a helper function to wrap passport.authenticate for use with async/await
function authenticatePassport(req, res) {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        reject(err);
      } else if (!user) {
        reject(new Error("No user found"));
      } else {
        req.logIn(user, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      }
    })(req, res);
  });
}

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email });

  try {
    const registeredUser = await User.register(user, password); // Assuming User.register returns a promise
    await authenticatePassport(req, res);
    res
      .status(200)
      .json({ success: true, message: "Registration successful!" });
  } catch (err) {
    console.error(err); // Log to console for debugging
    res.status(500).json({
      success: false,
      message: "Failed to register user.",
      err: err.message,
    });
  }
});

module.exports = router;
