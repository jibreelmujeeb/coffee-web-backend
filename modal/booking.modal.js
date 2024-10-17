const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  email: String,
  phone: String,
  time: String,
  date: String,
  bookingType: String,
  numberOfPeople: String,
  comment: String,
  menuSelect: [{ name: String, amount: Number }],
  status: String,
  ref: String,
  delivered: { type: Boolean, default: false },
});

const bookingModel = mongoose.model("Booking", bookingSchema);

module.exports = bookingModel;
