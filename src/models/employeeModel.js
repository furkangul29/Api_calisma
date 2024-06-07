const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  tc: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
