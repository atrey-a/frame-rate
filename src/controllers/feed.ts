import Router from "express";
export const feedRoute = Router.Router();
import { verifyAccessToken } from "../helpers/init_jwt.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

const postsPerPage = 10;

feedRoute.get("/:pg", verifyAccessToken, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const followingUsers = user.following;
    const posts = Post.find({
      userId: { $in: followingUsers },
    })
      .getFilter()
      .sort({ createdAt: -1 })
      .slice((req.params.pg - 1) * postsPerPage, req.params.pg * postsPerPage);
    res.send({ posts });
    return;
  } catch (err) {
    res.status(500).json(err);
  }
});
