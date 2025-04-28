async function logout(request, response) {
    try {
        const cookieOptions = {
            httpOnly: true, // Prevents client-side access
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            sameSite: 'none',
            expires: new Date(0) // Expire immediately
        };

        return response.cookie('token', '', cookieOptions).status(200).json({
            message: "Logout successful",
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true
        });
    }
}

module.exports = logout;
