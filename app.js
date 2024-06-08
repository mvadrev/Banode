require("dotenv").config(); // Load environment variables

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");

// Import database connection function
const MongoDB = require("./utils/connect_db");

const app = express();

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

console.log("SESSION_SECRET:", process.env.SESSION_SECRET);
console.log("DATABASE_URL:", process.env.DATABASE_URL);

// Establish connection to MongoDB
MongoDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

// Import routes
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const forgotPassword = require("./routes/forgotPassword");

// Use the imported routes
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/forgotPassword", forgotPassword);

// Simple hello world endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
