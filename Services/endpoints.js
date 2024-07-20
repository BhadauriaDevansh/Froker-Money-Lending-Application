const express = require('express');
const router = express.Router(); // Create an Express router instance
const auth = require('../Middlewares/authentication'); // Import authentication middleware
const {
    signup,
    login,
    getUser,
    borrowMoney
} = require('../Controllers/userController'); // Import controller functions

// Define endpoints for user-related operations 
router.post('/signup', signup);
router.post('/login', login);
router.get('/user', auth, getUser);
router.post('/borrow', auth, borrowMoney);

// Export the router for use in other parts of the application
module.exports = router;
