const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: { type: String, require: true },
  body: { type: String },
  userEmail: { type: String, require: true },
});

const blogModel = mongoose.model("blog", blogSchema);

module.exports = { blogModel };

// {
//     "name":"Naveen Bardhan",
//     "email":"npeemdom45@gmail.com",
//     "password":"8ufdae",
//     "role":"Moderator"
//   }
