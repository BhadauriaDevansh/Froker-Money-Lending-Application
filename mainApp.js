const express = require('express');
const connectDataBase = require('./Database/connection'); // Import the database connection function
const app = express(); // Create an instance of the Express application

// Connect Database
connectDataBase();


// Middleware to parse incoming JSON requests
app.use(express.json({ extended: false }));

// Route requests starting with '/api' to the endpoints defined in the endpoints module
app.use('/api', require('./Services/endpoints'));

// Set the port to listen on, default to 3000
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
