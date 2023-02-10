import mongoose from "mongoose";
import { Post } from "./Post.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requires: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  followers: {
    type:Array,
    default: []
  },
  following: {
    type:Array,
    default: []
  },
  posts: {
    type: Array<typeof Post>,
    default: []
  }
});

export const User = mongoose.model("User", userSchema);
