const app = require('./app')
const connectDatabase = require('./config/database')
const dotenv = require('dotenv');




//setteing up config file 
dotenv.config({ path: 'backend/config/config.env' })

app.listen(process.env.port, () => {
    console.log(`Backend Server started on port: ${process.env.port} in ${process.env.NODE_ENV}`);
})


//connecting to dabase 
connectDatabase();



app.get('/a', function(req, res, next) {
    console.log('req.body'); // not a string, but your parsed JSON data
    console.log('req.body.a'); // etc.
    // ...
});