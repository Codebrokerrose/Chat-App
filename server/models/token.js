// models/token.js
const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String, // ✅ Add this field
    required: false,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Token expires in 5 minutes (optional)
  },
});

module.exports = mongoose.model("Token", tokenSchema);
