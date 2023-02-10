import Router from "express";
export const postRoute = Router.Router();
import { verifyAccessToken } from "../helpers/init_jwt.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

postRoute.post("/new", verifyAccessToken, async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

postRoute.delete("/:id", verifyAccessToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Deleted.");
    } else {
      res.status(403).json("Invalid Request.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

postRoute.put("/like/:id", verifyAccessToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Liked.");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Like Removed.");
    }
  } catch (err) {
    res.send(500).json(err);
  }
});

postRoute.get("/likes/:id", verifyAccessToken, async (req,res) => {
  try {
    const post = await Post.findById(req.params.id);
    const nlikes = post.likes.length
    res.send({
      likes: nlikes
    })
  } catch (err) {
    res.send(500).json(err);
  }
})

postRoute.get("/flikes/:id", verifyAccessToken, async (req,res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.body.userId);
    const isFollowing = (userId) => (user.following.includes(userId));
    const nlikes = post.likes.filter(isFollowing).length
    res.send({
      likes: nlikes
    })
  } catch (err) {
    res.send(500).json(err);
  }
})

postRoute.put("/save/:id", verifyAccessToken, async (req,res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user.saved.includes(req.params.id)) {
      await user.updateOne({ $push : {saved: req.params.id}});
      res.status(200).json("Saved.")
    } else {
      await user.updateOne({ $pull : {saved: req.params.id}});
      res.status(200).json("Unsaved.")
    }
  } catch (err) {
    res.send(500).json(err);
  }
})
