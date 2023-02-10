import Router from "express";
export const userRoute = Router.Router();
import { User } from "../models/User.js";

userRoute.put("/follow/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("Followed.");
      } else {
        res.status(403).json("Already Following.");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Invalid Request");
  }
});

userRoute.put("/unfollow/:id", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("Unfollowed.");
        } else {
          res.status(403).json("Already Not Following.");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("Invalid Request");
    }
  });