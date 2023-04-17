const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema({
  token: { type: String, require: true },
});

const blacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = { blacklistModel };

// {
//     "name":"Naveen Bardhan",
//     "email":"npeemdom45@gmail.com",
//     "password":"8ufdae",
//     "role":"Moderator"
//   }
