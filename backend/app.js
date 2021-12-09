const express = require('express');
const app = express();

const errorMiddleware = require('./middlewares/errors')



app.use(express.json());


//Import all routes
const products = require('./routes/peoduct');
const auth = require('./routes/auth');



app.use('/api/v1', products)
app.use('/api/v1', auth)

//Middleware handle the error
app.use(errorMiddleware)






module.exports = app