const User = require('../Schema/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Global variable to keep track of total available funds
let totalAvailableFunds = 1000000; // 10 lakhs initially

// Approve Application During Signup
exports.signup = async (req, res) => {
    const { phoneNumber, email, name, dob, monthlySalary, password } = req.body;

    // Validation
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 20) return res.status(400).json({ msg: 'User must be above 20 years of age' });
    if (monthlySalary < 25000) return res.status(400).json({ msg: 'Monthly salary should be 25k or more' });

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({
            phoneNumber,
            email,
            name,
            dob,
            monthlySalary,
            password,
            status: 'Approved',
            purchasePower: 0 // Initial purchase power is 0
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // Generate JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login API
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Generate JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Show User Data
exports.getUser = async (req, res) => {
    try {
        // Fetch user details excluding password
        const user = await User.findById(req.user.id).select('-password');

        // Return the user data including date and time
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Borrow Money API
exports.borrowMoney = async (req, res) => {
    const { amount, tenureMonths } = req.body;

    // Validate input
    if (amount <= 0 || tenureMonths <= 0) {
        return res.status(400).json({ msg: 'Invalid amount or tenure months' });
    }

    try {
        // Find user and check existence
        let user = await User.findById(req.user.id);
        if (!user) return res.status(400).json({ msg: 'User not found' });

        // Check if the requested amount exceeds the total available funds
        if (amount > totalAvailableFunds) {
            return res.status(400).json({ msg: 'Requested amount exceeds available funds' });
        }

        // Calculate monthly repayment with interest
        const interestRate = 0.08;
        const monthlyRepayment = (amount * (1 + interestRate)) / tenureMonths;

        // Update total available funds and user's purchase power
        totalAvailableFunds -= amount;
        user.purchasePower += amount;
        await user.save();

        res.json({
            purchasePower: user.purchasePower, // Updated purchase power after borrowing
            monthlyRepayment,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

