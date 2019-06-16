const mongoose = require("mongoose");

const User = mongoose.model("User", {
  firstName: String,
  lastName: String,
  email: String,
  token: String,
  temporaryToken: String,
  salt: String,
  hash: String,
  forgotPasswordToken: String
});

module.exports = User;
