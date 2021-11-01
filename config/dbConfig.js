const mongoose = require('mongoose');

const dbConnct = async () => {
  const conn = await mongoose.connect(process.env.LOCAL_DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  })

  console.log(`MongoDB Connected: ${conn.connection.host}`.yellow.underline.bold);
}

module.exports = dbConnct;