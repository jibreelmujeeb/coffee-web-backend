const express = require("express");
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  verifyToken,
} = require("../controller/auth.controller");
const { booking, getBookings, deleteBooking } = require("../controller/booking.controller");

const router = express.Router();
router.delete('/deletebooking', deleteBooking)
router.post("/signup", signUp);
router.post("/booking", booking);
router.post("/getbooking", getBookings);
router.get('/verify-token', verifyToken);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
