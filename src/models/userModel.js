const mongoose = require("mongoose");
const momentTime = require("moment-timezone");
momentTime.tz.setDefault("Europe/Istanbul");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  reset: {
    code: {
      type: String,
      default: null,
    },
    time: {
      type: String,
      default: null,
    },
  },
});

const user = mongoose.model("users", userSchema);

module.exports = user;
