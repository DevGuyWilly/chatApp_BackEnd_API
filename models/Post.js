const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    description: {
      type: String,
      max: 500,
    },
    title: { type: String, required: [true, "A title is  required"] },
    image: {
      type: String,
    },
    likes: {
      type: Array,
      default: [0],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
