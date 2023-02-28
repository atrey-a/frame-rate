import express from "express";
import multer from "multer";
import {
  firebaseConfig,
  storage,
  app,
  // analytics,
  postRef,
} from "../helpers/init_firebase.js";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { verifyAccessToken } from "../helpers/init_jwt.js";
import createError from "http-errors";
import { File } from "../models/File.js";

export const fileRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

fileRoute.post(
  "/new",
  verifyAccessToken,
  upload.single("image_post"),
  async (req, res) => {
    //
    try {
      console.log("Uploading Image...");
      const timeMs = Date.now();
      const file = req.file;
      // console.log(file);
      const storageRef = ref(
        storage,
        `files/${file.originalname + " " + timeMs}`
      );
      const metadata = {
        contentType: file.mimetype,
      };
      const img = await uploadBytesResumable(storageRef, file.buffer, metadata);
      const img_url = await getDownloadURL(img.ref);
      const filePost = new File({
        fileUrl: img_url,
      });
      const savedFile = await filePost.save();
      console.log("Uploaded Image.");
      return res.send({
        imageId: savedFile._id,
      });
    } catch (err) {
      console.log(err.message);
      res.send(createError.InternalServerError());
    }
  }
);

fileRoute.get(":id", verifyAccessToken, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      res.status(403).send("Invalid Image Id");
    }
    res.send({
      imageUrl: file.fileUrl,
    });
  } catch (err) {
    console.log(err.message);
    res.send(createError.InternalServerError());
  }
});

fileRoute.delete(":id", verifyAccessToken, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      res.status(403).send("Invalid Image Id");
    }
    await file.deleteOne();
    res.status(200).send("Deleted.");
  } catch (err) {
    console.log(err.message);
    res.send(createError.InternalServerError());
  }
});
