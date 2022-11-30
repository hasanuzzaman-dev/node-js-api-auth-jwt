const express = require("express");
const morgan = require("morgan");
const mongoose = require('mongoose');
const createError = require("http-errors");
require("dotenv").config();
//require('./helper/init-mongodb');

const authRoute = require('./routes/authRoute.js');



const app = express();
app.use(morgan('dev'));
app.use(express.json());




app.get('/', async (req, res, next) => {
    res.send("Hello from express");
});

app.use('/auth', authRoute);

// error handling
app.use(async (req, res, next) => {
    // const error = new Error('Not Found!');
    // error.status = 404;
    // next(error);

    //next(createError.NotFound());

    next(createError.NotFound('This route does not exist!'))
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    })
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT}`);
});


//console.log(process.env.DB_CONNECTION_URL);
mongoose.connect(process.env.DB_CONNECTION_URL, () => {
    console.log('Connected DB at ' + process.env.DB_CONNECTION_URL);
});





