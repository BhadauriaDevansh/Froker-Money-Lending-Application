const mongoDatabase = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Connect to MongoDB database named 'moneyLending' on localhost
        await mongoDatabase.connect('mongodb://localhost:27017/moneyLending'); 
        console.log('MongoDB is connected'); // Log success message if connection is established
    } catch (err) {
        console.error(err.message); // Log error message if connection fails
        process.exit(1); // Exit the process with a failure code
    }
};

// Export the connectDB function for use in other modules
module.exports = connectDB;