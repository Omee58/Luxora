const mongoose = require('mongoose');
require('dotenv').config();
// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('\n-------------------------\nFailed to connect to MongoDB, Error is :\n-------------------------\n', err);
  });

module.exports = mongoose;
