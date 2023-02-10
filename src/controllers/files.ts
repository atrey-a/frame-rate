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

export const fileRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

fileRoute.post("/new", verifyAccessToken, upload.single("filename"), async (req, res) => {
  try {
    console.log("Uploading Image...");
    const timeMs = Date.now();
    const file = req.file;
    const storageRef = ref(
      storage,
      `files/${req.file.originalname + " " + timeMs}`
    );
    const metadata = {
      contentType: req.file.mimetype,
    };
    const img = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    const img_url = await getDownloadURL(img.ref);
    console.log("Uploaded Image.");
    return res.send({
      imageUrl: img_url,
    });
  } catch (err) {
    console.log(err.message);
  }
});
