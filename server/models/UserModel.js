const mongoose = require("mongoose");

// Define the schema for the User collection
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    profile_pic: {
      type: String,
      default: " ",
    },
    verified: {
      type: Boolean,
      default: false, // User is not verified by default
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
