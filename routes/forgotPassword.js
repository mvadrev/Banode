const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/User"); // Adjust the path as necessary

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("No user found with that email address.");
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour to expire
    await user.save();

    // Send an email
    const resetUrl = `localhost/reset-password/${resetToken}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USERNAME,
      subject: "Password Reset",
      text:
        `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `${resetUrl}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.send("Password reset email sent.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending password reset email.");
  }
});

module.exports = router;
