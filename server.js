const express = require('express');
const app = express();
require('dotenv').config(); // Load environment variables
const connectDB = require('./config/db')

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Middleware for parsing JSON

const PORT = process.env.PORT || 3000;

connectDB();

// Import user routes
const userRoutes = require('./routes/user.routes');

// Use the imported routes
app.use('/user', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
