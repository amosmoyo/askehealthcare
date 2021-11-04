/* eslint-disable no-undef */
const mongoose = require('mongoose');

const dbConnct = async () => {
  const conn = await mongoose.connect(`mongodb+srv://${process.env.MONGODB_URL_USER}:${process.env.MONGODB_URL_PASS}@cluster0.spg3d.mongodb.net/askehealthcare?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  })

  console.log(`MongoDB Connected: ${conn.connection.host}`.yellow.underline.bold);
}

module.exports = dbConnct;