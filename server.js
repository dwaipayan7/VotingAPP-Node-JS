const express = require('express');
const app = express();
require('dotenv').config(); // Load environment variables
const connectDB = require('./config/db')

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Middleware for parsing JSON

const PORT = process.env.PORT || 3000;

const jwt = (jwtAuthMiddleware) = require('./jwt')

connectDB();

// Import user routes
const userRoutes = require('./routes/user.routes');
const candidateRoutes = require('./routes/candidate.routes');


// Use the imported routes
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
