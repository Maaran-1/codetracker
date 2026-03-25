const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,

  lcUsername: String,
  ccUsername: String,
  gfgUsername: String,
hrUsername: String,
cfUsername: String,

  friends: {
    type: [String],
    default: []
  },

  requests: {
    type: [String],
    default: []
  },
  avatar: {
  type: String,
  default: "avatar1"
},
cfUsername: {
  type: String,
  default: ""
}
});


module.exports = mongoose.model("User", userSchema);