const mongoose = require('mongoose');

// Define the Schema for the user 
const UserSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true }, // Phone number of the user 
    email: { type: String, required: true, unique: true }, // Email address of the user (must be unique)
    name: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now }, // Date when the user registered (default to the current date and time)
    dob: { type: Date, required: true }, // Date of birth of the user
    monthlySalary: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }, // Status of the user's application with possible values: 'Pending', 'Approved', 'Rejected'
    password: { type: String, required: true }, // Encrypted password of the user
    purchasePower: { type: Number, default: 0 },  // Purchase power of the user (default is 0)
});

// Create and export the model based on the UserSchema
module.exports = mongoose.model('User', UserSchema);
