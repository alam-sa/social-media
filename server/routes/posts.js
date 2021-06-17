const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//CREATE POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch(err) {
    res.status(500).json(err)
  }
});

// UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("post has been updated")
    } else {
      res.status(403).json("you can only update your post")
    }
  } catch(err) {
    res.status(500).json(err)
  }

});

// DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("post has been deleted")
    } else {
      res.status(403).json("you can only delete your post")
    }
  } catch(err) {
    res.status(500).json(err)
  }

});

// LIKE OR DISLIKE POST
router.put("/:id/like", async(req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("the post has been liked")
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("the post has been disliked")
    }
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET A POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post)
  } catch(err) {
    res.status(500).json(err)
  }
});

// GET TIMELINE POSTS
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({  userId:  friendId})
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch(err) {
    res.status(500).json(err)
  }
});

module.exports = router