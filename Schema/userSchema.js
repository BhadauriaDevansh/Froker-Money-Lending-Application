const mongoDatabase = require('mongoose');

// Define a schema for loan repayments
const RepaymentSchema = new mongoDatabase.Schema({
    amount: { type: Number },
    tenureMonths: { type: Number },
    monthlyRepayment: { type: Number }
}, { _id: false }); // Disable _id for sub-documents

// Define the User schema
const UserSchema = new mongoDatabase.Schema({
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
    dob: { type: Date, required: true },
    monthlySalary: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    password: { type: String, required: true },
    purchasePower: { type: Number, default: 1000000 },
    totalLoanAmount: { type: Number, default: 0, select: false },
    totalMonthlyRepayment: { type: Number, default: 0, select: false },
    repayments: [RepaymentSchema] // Use the nested schema for repayments
}, { collection: 'User' });

const User = mongoDatabase.model('User', UserSchema);

module.exports = User;


