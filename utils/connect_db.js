const mongoose = require("mongoose");

const MongoDB = async () => {
  try {
    // Add connection options to improve connection stability
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout for initial connection to MongoDB
      socketTimeoutMS: 45000, // Timeout for other operations after connecting
    };

    // Connect to MongoDB using the connection URL from environment variables
    await mongoose.connect(process.env.DATABASE_URL, options);
    console.log("Successfully connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Optionally, you can handle reconnection logic or other fallbacks here
  }
};

module.exports = MongoDB;
