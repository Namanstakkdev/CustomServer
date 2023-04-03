 const {MONGO_DB_URL} = require("../config/config.json")

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose
  .connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });
