/* eslint-disable no-undef */
const express = require('express')
const dotenv = require('dotenv')
// eslint-disable-next-line no-unused-vars
const colors = require('colors')
const database = require('./config/dbConfig')

dotenv.config({path: './config/config.env'})

// initialize database connection
database();

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`The app is running in ${process.env.NODE_ENV} on port ${port}`.blue.bold);
})


// Handle unhandled promise rejections
// eslint-disable-next-line no-unused-vars
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
