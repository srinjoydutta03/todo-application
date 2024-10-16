const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { User } = require('../config/db');
require('dotenv').config();

router.get('/users/count', async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user count' });
    }
});

router.post('/signup', async(req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }


    try{
        const user = await User.findOne({username});
        if(user){
            throw new Error("User already exists");
        }
        else{
            const newUser = await User.create({
                username,
                password
            });
            return res.status(201).json({
                message: "User created successfully",
                user: { username: newUser.username }
            });
        }
    }
    catch(error){
        return res.status(400).json({
            message: "User already exists"
        });
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

module.exports = router;
