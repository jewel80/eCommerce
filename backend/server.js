const app = require('./app')

const dotenv = require('dotenv');


//setteing up config file
dotenv.config({ path: 'backend/config/config.env' })

app.listen(process.env.port, () => {
    console.log(`Server started on port: ${process.env.port}`);
})