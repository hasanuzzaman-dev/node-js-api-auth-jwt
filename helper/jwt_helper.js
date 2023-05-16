const JWT = require('jsonwebtoken');
const createError = require('http-errors');


module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};

            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: "1h",
                issuer: "www.cpl.com",
                audience: userId,
            };

            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);
                    //return reject(err);
                    return reject(createError.InternalServerError());
                }

                resolve(token);
            })
        })
    }
}