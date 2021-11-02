/* eslint-disable no-undef */
const mongoose = require('mongoose');

const dbConnct = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  })

  console.log(`MongoDB Connected: ${conn.connection.host}`.yellow.underline.bold);
}

module.exports = dbConnct;