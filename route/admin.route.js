const express = require("express");

const {
  signUp,
  login,
  verifyToken,
  adForgotPassword,
  verifyTokenForgotPassword,
  changePassword
} = require("../adminController/auth.controller");
const {
  getBookings,
  updateDeliver,
} = require("../adminController/booking.controller");
const {
  checkActivate,
  checkFirstAdmin,
  allAdmin,
  deleteAdmin,
  activateAdmin,
} = require("../adminController/adminActivate.controller");
const router = express.Router();

router.post("/signup", signUp);

router.post("/login", login);
router.get("/token", verifyToken);
router.post("/bookings", getBookings);
router.post("/deliver", updateDeliver);
router.post("/activateAdmin", checkActivate);
router.post("/checkfirstAdmin", checkFirstAdmin);
router.post("/allAdmins", allAdmin);
router.post("/activation", activateAdmin);
router.delete("/deleteadmin/:id", deleteAdmin);
router.post("/adminforgotpassword", adForgotPassword);
router.post("/changepassword", changePassword);
router.get("/verify-token", verifyToken);
router.get("/reset-password/:token", verifyTokenForgotPassword);

module.exports = router;
