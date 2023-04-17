const express = require("express");
const mongoose = require("mongoose");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.route");
const { blogRouter } = require("./routes/blog.route");
const { auth } = require("./middleware/auth.middleware");
const { authorization } = require("./middleware/authorization.middleware");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use("/users", userRouter);
app.use(auth);
app.use(authorization);
app.use("/blogs", blogRouter);
app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log("can not connect to DB");
  }
  console.log("server is listening at " + process.env.port);
});
