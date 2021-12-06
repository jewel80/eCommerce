const app = require('./app')
const connectDatabase = require('./config/database')
const dotenv = require('dotenv');

//Handle Uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`Error: ${err.stack}`);
    console.log(`Shutting Down Due to uncaught exception}`);
    process.exit(1)
})


//setteing up config file 
dotenv.config({ path: 'backend/config/config.env' })


//connecting to dabase 
connectDatabase();



const server = app.listen(process.env.port, () => {
    console.log(`Backend Server started on port: ${process.env.port} in ${process.env.NODE_ENV}`);
})

//Handle unhandle promise rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting Down the server due to unhandle promise rejection}`);
    server.close(() => {
        process.exit(1)
    })
})