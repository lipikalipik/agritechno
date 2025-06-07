const express = require('express');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Return user data and token
        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profile: user.profile
            },
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return user data and token
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profile: user.profile
            },
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 