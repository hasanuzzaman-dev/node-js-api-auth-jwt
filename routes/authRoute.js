const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const User = require('../models/user.model')
const { authSchema } = require('../helper/validation_schema');

router.post('/register', async (req, res, next) => {

    //console.log(req.body);
    try {
        //const { username, email, password } = req.body;

        //console.log(req.body);
        const joiResult = await authSchema.validateAsync(req.body);

        //console.log("joiResult: ",joiResult);

        //if (!username || !email || !password) throw createError.BadRequest();

        const userDoesExist = await User.findOne({ email: joiResult.email });
        if (userDoesExist) throw createError.Conflict(`${joiResult.email} is already exist!`);

        const hashedPassword = await bcrypt.hash(joiResult.password, 10);
        const user = new User({
            username: joiResult.username,
            email: joiResult.email,
            password: hashedPassword,
        });

        const savedUser = await user.save();

        res.json(savedUser)



    } catch (error) {
        if (error.isJoi === true) error.status = 422;

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