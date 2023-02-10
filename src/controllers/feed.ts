import Router from "express";
export const feedRoute = Router.Router();
import { verifyAccessToken } from "../helpers/init_jwt.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

feedRoute.get("/:pg", verifyAccessToken, (req, res) => {
  try {
    const currentUser = User.findById(req.body.userId)
    const posts = Post.find({
      userId: {$in : currentUser['following']}
    }).getFilter().sort({ createdAt: -1}).limit(10)
  } catch (err) {
    res.send(500).json(err);
  }
});
