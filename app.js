require("dotenv").config(); // Load environment variables

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const dataModel = require("./models/dataModel");
const cors = require("cors");

// Import database connection function
const MongoDB = require("./utils/connect_db");

const app = express();
app.use(cors());

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err); // Pass any errors to done.
  }
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

console.log("SESSION_SECRET:", process.env.JWT_SECRET);
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
// const forgotPassword = require("./routes/forgotPassword");

// Use the imported routes
app.use("/register", registerRoute);
app.use("/login", loginRoute);
// app.use("/forgotPassword", forgotPassword);

// Simple hello world endpoint
app.post("/", (req, res) => {
  const token = req.body.token;
  console.log("Token is", token);

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token." });
    }

    // Token is valid and decoded, now you can use the information in 'decoded'
    res.json({
      message: "Hello World!",
      decoded: decoded,
    });
  });
});

// data store
// Define the route
app.post("/addData", async (req, res) => {
  try {
    const { itemName, measurements } = req.body;
    console.log("what", itemName, measurements);
    const newItem = new dataModel({
      itemName,
      measurements,
    });
    await newItem.save();
    res.status(201).send({ message: "Data added successfully", data: newItem });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to add data", error: error.message });
  }
});

app.get("/getAllData", async (req, res) => {
  try {
    const data = await dataModel.find({});
    console.log("Data is", data);
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
});

// Heart
app.get("/h", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged in sduccessfully!",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
