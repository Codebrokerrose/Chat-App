const Token = require("../models/token");
const UserModel = require("../models/UserModel");

const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = await Token.findOne({ userId: user._id, token: code });
    if (!token) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    // Optionally delete token if single use
    // await token.deleteOne();

    return res.status(200).json({ message: "Code verified", userId: user._id });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = verifyResetCode;
