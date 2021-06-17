const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require("bcrypt")

// GET A USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
})

// UPDATE USER
router.put("/:id", async (req, res) => {
  if(req.body.userId === req.params.id || req.body.isAdmin) {
    if(req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err)
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
      });
      res.status(200).json("account has been updated");
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json("you can only update your account")
  }
});
// DELETE USER
router.delete("/:id", async (req, res) => {
  if(req.body.userId === req.params.id || req.body.isAdmin) {
    try {
     await User.findByIdAndDelete(req.params.id);
      res.status(200).json("account has been deleted");
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json("you can only delete your account")
  }
});

// FOLLOW USER
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    console.log("masukk");
    try {
      const user = await User.findById(req.params.id);
      const currentUser =  await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.body.userId } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch(err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can't follow yourself");
  }
})


module.exports = router