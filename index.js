const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const userRouter = require("./route/user.route");
const adminRouter = require("./route/admin.route");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(cors("*"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/", userRouter);

app.get("/greeting", (req, res) => {
  res.send("Welcome");
});

app.listen(PORT, () => {
  console.log("App listening on port", PORT);
});
