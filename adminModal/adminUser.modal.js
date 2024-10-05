const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  activate: { type: Boolean, default: false },
  forgotPassword: String,
});

adminSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) {
      } else {
        this.password = hash;
        next();
      }
    });
  }
});

adminSchema.methods.comparePassword = async function (adminPassword) {
  try {
    const password = await bcrypt.compare(adminPassword, this.password);
    return password;
  } catch (err) {
    return false;
  }
};

const adminModel = mongoose.model("admin", adminSchema);

module.exports = adminModel;
