const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Ensure the correct path to your model
const Candidate = require('../models/candidate'); // Add the correct path to your Candidate model
const { jwtAuthMiddleware } = require('../jwt'); 

// Function to check if the user is an admin
const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.role === 'admin';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};

// POST route to add a candidate
router.post('/', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: 'User does not have admin permission' });
    }

    const data = req.body;
    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();

    console.log('Candidate data saved');
    res.status(200).json({ response });
  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT route to update a candidate (JWT protected)
router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: 'User does not have admin permission' });
    }

    const candidateID = req.params.candidateID;
    const updateData = req.body;

    const response = await Candidate.findByIdAndUpdate(candidateID, updateData, {
      new: true,
      runValidators: true,
    });

    if (!response) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.status(200).json({ message: 'Candidate data updated successfully', response });
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE route to delete a candidate
router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: 'User does not have admin permission' });
    }

    const candidateID = req.params.candidateID;

    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
