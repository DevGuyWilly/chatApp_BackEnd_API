const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// UPDATING USEER
router.put("/:id", async (req, res) => {
  if (req.params.id === req.body.id || req.body.isAdmin) {
    try {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt();
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (error) {
          res.status(500).json({
            error: "Error while hashing password",
          });
        }
      }
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({
        success: "Account Updated",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error while updating user",
      });
    }
  } else {
    res.status(500).json({
      error: "You are not allowed to update this user",
    });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  if (req.params.id === req.body.id || req.body.isAdmin) {
    try {
      const user = await User.deleteOneAndDelete(req.params.id);
      res.status(200).json({
        success: "Account Deleted",
        data: [user],
      });
    } catch (error) {
      res.status(500).json({
        error: "Error while deleting user",
      });
    }
  } else {
    res.status(500).json({
      error: "You are not allowed to Delete this user",
    });
  }
});
// GET A USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne(req.params.id);
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json({
      success: "Account Found",
      data: [others],
    });
  } catch (error) {
    res.status(500).json({
      error: "Error finding user",
    });
  }
});
//FIND A USER BY ID AND FOLLOW USER
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId === req.params.id) {
    res.status(403).status({
      error: "You can't follow yourself",
    });
  } else {
    try {
      const user = await User.findById(req.params.userId);
      const currUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        res.status(403).status({
          error: "You are already following this user",
        });
      } else {
        await user.updateOne({ $set: { followers: req.body.userId } });
        await currUser.updateOne({ $set: { following: req.params.userId } });
        res.status(200).json({
          success: "You are now following this user",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: "Error while following user",
      });
    }
  }
});

//FIND A USER BY ID AND UNFOLLOW USER
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId === req.params.id) {
    res.status(403).status({
      error: "You can't unfollow yourself",
    });
  } else {
    try {
      const user = await User.findById(req.params.userId);
      const currUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        res.status(403).status({
          error: "You are not following this user",
        });
      } else {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currUser.updateOne({ $pull: { following: req.params.userId } });
        res.status(200).json({
          success: "You are have now unfollowed this user",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: "Error while unfollowing user",
      });
    }
  }
});

module.exports = router;
