const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const PassResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  resetOTP: {
    type: String,
    required: [true, "resetOTP is required"],
    unique: true,
  },
  createdAt: {
    type: Date,
    required: [true, "createdAt field is required"],
  },
  expiresAt: {
    type: Date,
    required: [true, "expiresAt field is required"],
  },
});

PassResetSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.resetOTP = bcrypt.hash(this.resetOTP, salt);
  next();
});

PassResetSchema.statics.check = async function (email, password) {
  const PassResetSchema = await this.findOne({ user });
  if (user) {
    const auth = await bcrypt.compare(resetOTP, PassResetSchema.resetOTP);
    if (auth) {
      return auth;
    }
    throw Error("Incorrect OTP");
  }
  throw Error("No OTP Generated for this user");
};

module.exports = mongoose.model("PassResetSchema", PassResetSchema);
