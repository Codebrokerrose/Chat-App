const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

async function checkPassword(request, response) {
    try {
        const { password, userId } = request.body;

        console.log("Received userId:", userId); // Debugging

        // Validate userId format
        if (!mongoose.isValidObjectId(userId)) {
            return response.status(400).json({
                message: "Invalid userId format",
                error: true
            });
        }

        // Find user in database
        const user = await UserModel.findById(userId);

        // Handle case where user does not exist
        if (!user) {
            return response.status(404).json({
                message: 'User not exists',
                error: true
            });
        }

        // Check if password is correct
        const verifyPassword = await bcryptjs.compare(password, user.password);

        if (!verifyPassword) {
            return response.status(400).json({
                message: 'Invalid Password',
                error: true
            });
        }

        // Create JWT Token
        const tokenData = {
            id: user._id,
            email: user.email
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
            expiresIn: '1d'
        });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none'
        };

        return response.cookie('token', token, cookieOptions).status(200).json({
            message: 'Login Successfully',
            token: token,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = checkPassword;
