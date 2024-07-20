const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Approve Application During Signup
exports.signup = async (req, res) => {
    const { phoneNumber, email, name, dob, monthlySalary, password } = req.body;

    // Validation
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 20) return res.status(400).json({ msg: 'User must be above 20 years of age' });
    if (monthlySalary < 25000) return res.status(400).json({ msg: 'Monthly salary should be 25k or more' });

    try {
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
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

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
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

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
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Borrow Money API
exports.borrowMoney = async (req, res) => {
    const { amount, tenureMonths } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(400).json({ msg: 'User not found' });

        const interestRate = 0.08;
        const monthlyRepayment = (amount * (1 + interestRate)) / tenureMonths;

        user.purchasePower -= amount;
        await user.save();

        res.json({
            purchasePower: user.purchasePower,
            monthlyRepayment,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
