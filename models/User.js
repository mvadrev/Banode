const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  //   admin: {
  //     type: Boolean,
  //     default: false,
  //   },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
