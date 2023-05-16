const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const User = require('../models/user.model')
const { authSchema, validateLoginSchema } = require('../helper/validation_schema');
const { signAccessToken, verifyAccessToken } = require('../helper/jwt_helper');

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

        console.log(savedUser._id.toString());

        const accessToken = await signAccessToken(savedUser._id.toString());

        res.json({ accessToken });



    } catch (error) {
        if (error.isJoi === true) error.status = 422;

        next(error)
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const result = await validateLoginSchema.validateAsync(req.body);

        const user = await User.findOne({ email: result.email });
        if (!user) {
            throw createError.NotFound("User not registered!");
        }

        try {
            const isMatch = await bcrypt.compare(result.password, user.password);
            if (!isMatch) {
                throw createError.Unauthorized("Username/Password not valid!");
            }

            const accessToken = await signAccessToken(user.id);
            res.send({ accessToken });

        } catch (error) {
            throw error;
        }

    } catch (error) {
        if (error.isJoi === true) {
            return next(createError.BadRequest("Invalid Username/Password!"));
        }
        next(error);
    }
});

router.post('/refresh-token', async (req, res, next) => {
    res.send("refresh-token route");
});

router.get('/profile', verifyAccessToken, async (req, res, next) => {
    console.log(req.headers['authorization']);


    const userId = req.payload.aud
    console.log("userId: ", userId);

    try {
        const user = await User.findById(userId);
        res.send(user);
    } catch (err) {
        throw err;
    }


});

router.post('/logout', async (req, res, next) => {
    res.send("logout route");
});

module.exports = router;