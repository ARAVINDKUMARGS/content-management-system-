const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "lumen_cms",
        });

        console.log("MongoDB connected successfully");
        console.log("Database:", mongoose.connection.name);

    } catch (error) {
        console.log("MongoDB connection failed");
        console.log(error.message);
    }
};

module.exports = connectDB;