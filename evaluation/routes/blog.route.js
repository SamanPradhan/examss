const express = require("express");
const blogRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { blogModel } = require("../models/blog.model");
const { blacklistModel } = require("../models/blacklist.model");

//create blog
blogRouter.post("/add", async (req, res) => {
  const { title, body, userEmail } = req.body;
  console.log(req.body);
  try {
    const newBlog = new blogModel(req.body);
    await newBlog.save();
    console.log(newBlog);

    res.status(200).send({ msg: "New Blog created successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message });
  }
});
//see blog
blogRouter.get("/", async (req, res) => {
  console.log(req);
  try {
    const findBlog = await blogModel.findOne({ email: req.userEmail });

    console.log(findBlog);
    res.status(200).send(findBlog);
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message });
  }
});

//update
blogRouter.patch("/update/:id", async (req, res) => {
  console.log(req);
  let id = req.params.id;
  try {
    await blogModel.findByIdAndUpdate(id, req.body);

    res.status(200).send({ msg: " Blog updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message });
  }
});

//delete
blogRouter.delete("/delete/:id", async (req, res) => {
  console.log(req);
  let id = req.params.id;
  try {
    await blogModel.findByIdAndDelete({ _id: id });

    res.status(200).send({ msg: " Blog deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message });
  }
});
module.exports = { blogRouter };
