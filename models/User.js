const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "You must have a username"],
      min: 3,
      max: 20,
      unique: [true, "Username must be unique"],
    },
    email: {
      type: String,
      required: [true, "You must have an email address"],
      max: 50,
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    prfilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
