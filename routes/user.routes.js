const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Ensure the correct path to your model
const { jwtAuthMiddleware, generateToken } = require('../jwt'); // Ensure jwt functions are correct

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const data = req.body;
    const newUser = new User(data);
    const response = await newUser.save();
    console.log('Data Saved');

    const payload = {
      id: response._id, // Make sure to use `_id` for MongoDB
    };

    const token = generateToken(payload);
    console.log("Token is: " + token);

    res.status(200).json({ response, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;

    const user = await User.findOne({ aadharCardNumber });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const payload = {
      id: user._id,
    };

    const token = generateToken(payload);

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Profile route (JWT protected)
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update password route (JWT protected)
router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!await user.comparePassword(currentPassword)) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    // Update the user password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
