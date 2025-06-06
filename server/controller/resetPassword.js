const UserModel = require("../models/UserModel");
const Token = require("../models/token");
const bcrypt = require("bcryptjs");

const resetPassword = async (req, res) => {
  const { email, code, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = await Token.findOne({ userId: user._id, token: code });
    if (!token) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Remove token after successful reset
    await token.deleteOne();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error resetting password.", error: error.message });
  }
};

module.exports = resetPassword;
