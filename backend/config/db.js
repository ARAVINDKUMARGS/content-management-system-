const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.warn('[Lumen Database] WARNING: MONGO_URI environment variable is not defined.');
      return null;
    }

    // Connect with explicit dbName: 'lumen_cms' to ensure shared team database
    const conn = await mongoose.connect(mongoURI, {
      dbName: 'lumen_cms',
    });

    // Safe logging displaying the cluster hostname without exposing credentials
    console.log(`[Lumen Database] Connected to MongoDB Atlas (cluster0.c6ksgra.mongodb.net)`);
    console.log(`[Lumen Database] Database Name: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    // Sanitize any potential sensitive text in connection errors
    const safeMsg = error.message.replace(/:\/\/.*@/, '://<credentials>@');
    console.error(`[Lumen Database] MongoDB Connection Error: ${safeMsg}`);
    throw error;
  }
};

module.exports = connectDB;
