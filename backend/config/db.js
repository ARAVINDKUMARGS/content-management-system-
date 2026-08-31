const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.warn(
        '[Lumen Database] WARNING: MONGODB_URI environment variable is not defined.'
      );
      return null;
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(
      '[Lumen Database] Connected to MongoDB Atlas'
    );
    console.log(
      `[Lumen Database] Database Name: ${conn.connection.name}`
    );

    return conn;
  } catch (error) {
    const safeMsg = error.message.replace(
      /:\/\/.*@/,
      '://<credentials>@'
    );

    console.error(
      `[Lumen Database] MongoDB Connection Error: ${safeMsg}`
    );

    throw error;
  }
};

module.exports = connectDB;