require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const quizRoutes = require("./routes/quizRoutes");

const app = express();

app.use(cors());


// Middleware
app.use(express.json());


// Database
connectDB();


// Routes
app.get("/", (req, res) => {
    res.json({
        message: "Server is working"
    });
});

app.use("/api/quizzes", quizRoutes);


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});