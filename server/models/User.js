const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);