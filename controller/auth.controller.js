const mongoose = require("mongoose");
const userTable = require("../modal/signup.modal");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRETKEY;


const signUp = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const found = await userTable.findOne({ email });
    if (found) {
      return res.status(400).send({
        msg: "This email address is already registered",
        status: false,
      });
    }

    const user = new userTable({ fullname, email, password });
    await user.save();
    res.status(201).send({ msg: "User registered successfully", status: true });
  } catch (err) {
    res.status(500).send({ msg: "Failed to register", status: false });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const found = await userTable.findOne({ email });
    if (!found) {
      return res
        .status(401)
        .send({ msg: "Invalid email or password", status: false });
    }

    const checkPassword = await found.comparePassword(password);
    if (checkPassword) {
      res.send({ msg: "Logged in successfully", status: true, user: found });
    } else {
      res.status(401).send({ msg: "Incorrect password", status: false });
    }
  } catch (err) {
    res.status(500).send({ msg: "Failed to login", status: false });
  }
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userTable.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ msg: "Email address not found", status: false });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
      expiresIn: "1h",
    });
    const resetURL = `${process.env.FRONT_END_URL}/reset-password/${token}`;

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
      text: `You requested a password reset. Click the link to reset your password: ${resetURL}`,
      html: `<p>You requested a password reset.</p><p>Click the link below to reset your password:</p><a href="${resetURL}">Reset Password</a>`,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .send({ msg: "Password reset link sent to your email", status: true });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).send({ msg: "Failed to process request", status: false });
  }
};


const resetPassword = async (req, res) => {
  const token = req.query.token;
  const { newPassword } = req.body;

  console.log({ token });

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await userTable.findOne({
      _id: decoded.userId,
      email: decoded.email,
    });

    if (!user) {
      return res.status(404).send({ msg: "User not found", status: false });
    }

    user.password = newPassword; 
    await user.save();

    res.send({ msg: "Password updated successfully", status: true });
  } catch (err) {
    res.status(400).send({ msg: "Invalid or expired token", status: false });
  }
};


const verifyToken = (req, res) => {
  const token = req.query.token;  

  if (!token) {
    return res.status(401).send({ msg: "No token provided", status: false });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ msg: "Invalid or expired token", status: false });
    }
    res.send({ status: true });
  });
  
};

module.exports = { signUp, login, forgotPassword, resetPassword, verifyToken };
