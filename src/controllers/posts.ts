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

postRoute.put("/:id/like", verifyAccessToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Liked.");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
    }
  } catch (err) {
    res.send(500).json(err);
  }
});

postRoute.get("/feed/:pg", verifyAccessToken, (req, res) => {
  try {
    const currentUser = User.findById(req.body.userId)
    const posts = Post.find({
      userId: {$in : currentUser['following']}
    }).getFilter().sort({ createdAt: -1}).limit(10)
  } catch (err) {
    res.send(500).json(err);
  }
});

