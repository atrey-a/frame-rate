import Router from "express";
export const postRoute = Router.Router();
import { verifyAccessToken } from "../helpers/jwt_helper.js";
// import { verify } from "./verifyToken.js";
import multer from 'multer'

postRoute.get("/", verifyAccessToken, (req, res) => {
  res.send(req.user);
});

postRoute.post("/")
