const express = require('express');
const app = express();

const errorMiddleware = require('./middlewares/errors')



app.use(express.json());


//Import all routes
const products = require('./routes/peoduct');



app.use('/api/v1', products)

//Middleware handle the error
app.use(errorMiddleware)






module.exports = app