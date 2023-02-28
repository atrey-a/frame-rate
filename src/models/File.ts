import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileUrl : {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const File = mongoose.model("File", fileSchema);
