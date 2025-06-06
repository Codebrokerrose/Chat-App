const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const TokenModel = require("../models/token");

// Email verification route
router.get("/:id/verify/:token", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res
        .status(400)
        .send({ message: "Invalid verification link - user not found" });
    }

    const token = await TokenModel.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).send({ message: "Invalid or expired token" });
    }

    user.verified = true;
    await user.save();
    await token.deleteOne();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    res
      .status(500)
      .send({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;
