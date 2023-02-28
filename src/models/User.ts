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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  refreshToken: {
    type: String,
    default: "",
  },
  followers: {
    type: Array<String>,
    default: [],
  },
  following: {
    type: Array<String>,
    default: [],
  },
  posts: {
    type: Array<String>,
    default: [],
  },
  saved: {
    type: Array<String>,
    default: [],
  },
});

export const User = mongoose.model("User", userSchema);
