const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const users = [
  {
    name: "Shyam",
    avatar: "S",
    status: "online",
    lastMessage: "",
  },
  {
    name: "Rakesh",
    avatar: "R",
    status: "online",
    lastMessage: "Hey! How are you?",
  },
  {
    name: "Sadanand",
    avatar: "S",
    status: "online",
    lastMessage: "Project update?",
  },
  {
    name: "Poojitha",
    avatar: "P",
    status: "offline",
    lastMessage: "Okay, thank you!",
  },
  {
    name: "Sanika",
    avatar: "S",
    status: "online",
    lastMessage: "I will check it.",
  },
  {
    name: "Ashmitha",
    avatar: "A",
    status: "offline",
    lastMessage: "See you tomorrow.",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected ✅");

    await User.deleteMany({});

    console.log("Old users deleted ✅");

    await User.insertMany(users);

    console.log("6 users inserted successfully ✅");

    await mongoose.connection.close();

    console.log("Database connection closed ✅");
  } catch (error) {
    console.error("Seed failed ❌");
    console.error(error.message);
  }
};

seedDatabase();