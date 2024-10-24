const mongoose = require("mongoose");
const adminTable = require("../adminModal/adminUser.modal");
const jwt = require("jsonwebtoken");
const adminDb = require("../adminModal/adminUser.modal");
const secretKey = process.env.SECRETKEY;
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");


const signUp = (req, res) => {
  // Define the schema for the user's profile

  const { email, username, password } = req.body;

  adminTable.findOne({ email }).then((found) => {
    if (found) {
      res.send({
        msg: "This email address is already registerd",
        status: false,
      });
    } else {
      const user = new adminTable(req.body);
      user
        .save()
        .then((result) => {
          if (result) {
            res.send({ msg: "Admin registered successfully", status: true });
          }
        })
        .catch((err) => {
          res.send({ msg: "Failed to register", status: false });
        });
    }
  });
};

const adForgotPassword = async (req, res) => {
  const email = req.body.email;

  const admin = await adminDb.findOne({ email });

  if (!admin) return res.sendStatus(404).send({ message: "user not found" });
  const token = jwt.sign(
    { userId: admin._id, email: admin.email }, 
    secretKey, 
    { expiresIn: "1h" } 
  );

 
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Click the link to reset your password: https://coffee-web-theta.vercel.app/admin/reset-password/${token}`,
    html: `<p>You requested a password reset.</p><p>Click the link below to reset your password:</p><a href="https://coffee-web-theta.vercel.app/admin/reset-password/${token}">Reset Password</a>`,
  };
  transporter.sendMail(mailOptions);

  adminDb
    .findOneAndUpdate(
      { email },
      { $set: { forgotPassword: token } },
      { new: true }
    )
    .then((admin) => {
      res.send({
        status: true,
        msg: "Reset password link successfully sent to your mail address",
      });
    })
    .catch((err) => {
      res.send({ msg: "Failed to activate admin", status: false });
    });
};


const verifyTokenForgotPassword = (req, res) => {
  const token = req.params.token;
  adminDb
    .findOne({ forgotPassword: token })
    .then(() => {
      res.send({ msg: "Password reset token verified", status: true });
    })
    .catch((err) => {
      res.send({
        msg: "Password reset token is invalid",
        status: false,
      });
     
    });
  res.redirect("https://coffee-web-theta.vercel.app/admin/Reset-Password/");
};

const login = (req, res) => {
  const { email, password } = req.body;
  adminTable
    .findOne({ email })
    .then(async (found) => {
      if (found) {
        const checkpassword = await found.comparePassword(password);
        if (checkpassword) {
          const token = jwt.sign(
            { userId: found._id, email: found.email }, 
            secretKey, 
            { expiresIn: "1h" } 
          );
          let obj = {
            email: found.email,
            userId: found._id,
            username: found.username,
          };
          res.send({
            msg: "Logged in successfully",
            status: true,
            user: found,
            token,
            user: obj,
          });
        } else {
          res.send({ msg: "Incorrect password", status: false });
        }
      } else {
        res.send({ msg: "Email address not found", status: false });
      }
    })
    .catch((err) => {
      res.send({ msg: "Failed to login", status: false });
    });
};

const changePassword = async (req, res) => {
  const { newPassword, email } = req.body;
  await bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
    } else {
      adminDb
    .findOneAndUpdate({ email }, { password: hash })
    .then((admin) => {
      res.send({ msg: "Password changed successfully", status: true });
    })
    .catch((err) => {
      res.send({ msg: "Failed to change password", status: false });
    });
    }
  });

};


const verifyToken = (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    return res.status(403).send({ msg: "No token provided", status: false });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ msg: "Unauthorized", status: false });
    } else {
      res
        .status(201)
        .send({ msg: "Valid token", details: decoded, status: true });
    }

  });
};

module.exports = {
  signUp,
  login,
  verifyToken,
  adForgotPassword,
  verifyTokenForgotPassword,
  changePassword,
};
