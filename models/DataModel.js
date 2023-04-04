const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const DataSchema = new mongoose.Schema({
  data: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  createdAt: {
    type: Date,
    required: [true, "createdAt field is required"],
  },
  modifiedAt: {
    type: Date,
    required: [true, "modifiedAt field is required"],
  },
});

module.exports = mongoose.model("Data", DataSchema);
