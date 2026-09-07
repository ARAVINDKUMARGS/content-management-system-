const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoURI) {
      console.warn(
        '[Lumen Database] WARNING: MONGODB_URI environment variable is not defined.'
      );
      return null;
    }

    const conn = await mongoose.connect(mongoURI, { dbName: 'content_management_system' });

    console.log(
      '[Lumen Database] Connected to MongoDB Atlas (cluster0.c6ksgra.mongodb.net)'
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