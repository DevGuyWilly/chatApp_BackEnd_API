const router = require("express").Router();
const { resolveSoa } = require("dns");
const { appendFile } = require("fs");
const Post = require("../models/Post");
const User = require("../models/User");

router.get("/", (req, res) => {
  res.send("Post Route");
});

// create post
router.post("/", async (req, res) => {
  const post = new Post(req.body);
  try {
    const savedPost = await post.save();
    res.status(200).json({
      message: "Post created",
      post: savedPost,
    });
  } catch (error) {}
  res.status(500).json({
    message: "Error creating post",
  });
});
// update post
router.put("/:id", async (req, res) => {
  try {
    const post = Post.findById(req.params.id);
    if (post.userId === req.body.id) {
      const updatedPost = await post.updateOne({ $set: req.body });
      res.status(200).json({
        message: "Post updated",
        post: updatedPost,
      });
    } else {
      res.send(403).json({
        message: "You can't edit this post",
      });
    }
  } catch (error) {
    res.send(500).json({
      message: "Error updating post",
    });
  }
});
// delete post
router.put("/:id", async (req, res) => {
  try {
    const post = Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      post.deleteOne();
      res.status(200).json({
        message: "Post deleted",
        post: post,
      });
    }
  } catch (error) {
    res.send(500).json({
      message: "Error deleting post",
    });
  }
});
// like post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json({
        message: "Post dis-liked",
      });
    }
  } catch (error) {}
});

//get post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json({
      message: "Post found",
      post: post,
    });
  } catch (error) {
    res.send(500).json({
      message: "Error getting post",
    });
  }
});

// get timeline posts
router.get("/timeline/all", async (req, res) => {
  let postArray = [];
  try {
    const currentUser = await User.findById(req.body.userId);
    const currentUserPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendsId) => {
        return Post.find({ userId: friendsId });
      })
    );
    res.json(currentUserPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json({
      message: "Error getting timeline posts",
    });
  }
});

module.exports = router;
