import express from "express";
import multer from "multer";
import { firebaseConfig, storage, app, postRef } from "../helpers/init_firebase.js";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const fileRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

fileRouter.post('/upload', upload.single('filename'), async (req,res) => {
  try {
    console.log("Uploading Image...")
    const file = req.file;
    if (file) {
      uploadBytesResumable(postRef, file).then((success) => {
        res.status(200).send({
          status: "Success!"
        })
      })
    }
  } catch (err) {
    console.log(err.message)
  }
})

fileRouter.get('/download')

fileRouter.delete('/delete')
