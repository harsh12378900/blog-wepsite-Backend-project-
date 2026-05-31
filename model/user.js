const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default;
const Post = require("./post");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
  },
  post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);