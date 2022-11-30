const express = require('express');
const router = express.Router();
const createError = require('http-errors');

const User = require('../models/user.model')

router.post('/register', async (req, res, next) => {

    console.log(req.body);
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) throw createError.BadRequest();

        const userDoesExist = await User.findOne({ email: email });
        if (userDoesExist) throw createError.Conflict(`${email} is already exist!`);

        const user = new User({ name, email, password });

        const savedUser = await user.save();

        res.json(savedUser)



    } catch (error) {
        next(error)
    }
});

router.post('/login', async (req, res, next) => {
    res.send("login route");
});

router.post('/refresh-token', async (req, res, next) => {
    res.send("refresh-token route");
});

router.post('/logout', async (req, res, next) => {
    res.send("logout route");
});

module.exports = router;