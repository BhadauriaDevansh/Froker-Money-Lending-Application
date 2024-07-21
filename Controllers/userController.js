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
            purchasePower: 1000000, // Initial purchase power is 0
            totalLoanAmount: 0, // Initial total loan amount
            totalMonthlyRepayment: 0 // Initial total monthly repayment
        });

        // Hash password
        const encryptedPassword = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,encryptedPassword);

        // Save user to database
        await user.save();

        // Generate JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, 'jwtSecretKey', { expiresIn: '1h' }, (err, token) => {
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
        if (!user) return res.status(400).json({ msg: 'Invalid User Email' });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid User Password' });

        // Generate JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, 'jwtSecretKey', { expiresIn: '1h' }, (err, token) => {
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
        // Fetch user details by inserting the generated token in body
        const user = await User.findById(req.user.id)
            .select('-password -totalLoanAmount -totalMonthlyRepayment -repayments');
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
        // Find user by inserting the generated token in body and check existence
        let user = await User.findById(req.user.id);
        if (!user) return res.status(400).json({ msg: 'User not found' });

        // Check if the requested amount exceeds the user's purchase power
        if (amount > user.purchasePower) {
            return res.status(400).json({ msg: 'Requested amount exceeds purchase power' });
        }

        // Calculate monthly repayment for the new amount borrowed
        const annualInterestRate = 0.08; // 8% annual interest
        const monthlyInterestRate = annualInterestRate / 12;
        const newMonthlyRepayment = (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) / (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);

        // Update user details
        user.totalLoanAmount = (user.totalLoanAmount || 0) + amount;

        // Add new repayment to the list of repayments
        user.repayments = user.repayments || []; // Initialize if not exists
        user.repayments.push({
            amount,
            tenureMonths,
            monthlyRepayment: newMonthlyRepayment
        });

        // Recalculate total monthly repayment
        user.totalMonthlyRepayment = user.repayments.reduce((total, repayment) => total + repayment.monthlyRepayment, 0);

        user.purchasePower -= amount;
        await user.save();

        res.json({
            purchasePower: user.purchasePower, // Updated purchase power after borrowing
            totalLoanAmount: user.totalLoanAmount, // Total loan amount after borrowing
            totalMonthlyRepayment: user.totalMonthlyRepayment // Cumulative monthly repayment amount
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
