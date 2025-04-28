const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function userDetails(request, response) {
    try {
        const token = request.cookies.token || (request.headers.authorization && request.headers.authorization.split(' ')[1]) || "";
        const user = await getUserDetailsFromToken(token);

        if (user.logout) {
            return response.status(401).json(user);  // Send session expiry response
        }

        return response.status(200).json({
            message: "User details fetched successfully",
            data: user
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Something went wrong",
            error: true
        });
    }
}

module.exports = userDetails;
