const jwt = require('jsonwebtoken');

// Auth to validate JSON Web Token (JWT)
module.exports = function (req, res, next) {
    // Extract token from the request header
    const token = req.header('authenticationToken');

    // If no token is provided, return a 401 Unauthorized response
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, 'jwtSecretKey');

        // Attach the decoded user information to the request object
        req.user = decoded.user;

        // Call the next Auth or route handler
        next();
    } catch (e) {
        // If token verification fails, return a 400 Bad Request response
        res.status(400).json({ msg: 'Token is not valid' });
    }
};
