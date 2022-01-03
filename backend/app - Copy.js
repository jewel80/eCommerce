const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary')

const dotenv = require('dotenv');

const errorMiddleware = require('./middlewares/errors')

dotenv.config({ path: 'backend/config/config.env' })


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());


//Setting up clodeinary 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//Import all routes
const products = require('./routes/product');
const auth = require('./routes/auth');
const payment = require('./routes/payment');
const order = require('./routes/order');



app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use("/api/v1", order);
app.use("/api/v1", payment);

//Middleware handle the error
app.use(errorMiddleware)



module.exports = app