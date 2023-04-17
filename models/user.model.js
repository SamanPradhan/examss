const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  role: { type: String, default: "User", enum: ["User", "Moderator"] },
});

const userModel = mongoose.model("users", userSchema);

module.exports = { userModel };

// {
//     "name":"Naveen Bardhan",
//     "email":"npeemdom45@gmail.com",
//     "password":"8ufdae",
//     "role":"Moderator"
//   }
