import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    max: 120
  },
  image: {
    type: String,
    required: true
  },
  likes: {
    type: Array<String>,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const Post = mongoose.model("Post", postSchema);
