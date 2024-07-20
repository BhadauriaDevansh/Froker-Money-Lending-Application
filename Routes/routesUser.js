const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/authentication');
const {
    signup,
    login,
    getUser,
    borrowMoney
} = require('../Controllers/controllerUser');

// Routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/user', auth, getUser);
router.post('/borrow', auth, borrowMoney);

module.exports = router;
