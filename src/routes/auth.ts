import Router from "express";
export const authRoute = Router.Router();
import { User } from "../model/User.js";
import {
  registerValidation,
  loginValidation,
} from "../helpers/validation_helper.js";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../helpers/jwt_helper.js";
import createError from "http-errors";

authRoute.post("/register", async (req, res) => {
  //Validate data before User
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).send("Email already exists");
  }

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);
    res.send({ accessToken, refreshToken });
  } catch (err) {
    res.status(400).send(err);
  }
});

authRoute.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Email/Password is wrong");
  }

  const isValidPass = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPass) {
    return res.status(400).send("Email/Password is wrong");
  }

  const accessToken = await signAccessToken(user.id);
  const refreshToken = await signRefreshToken(user.id);
  res.send({ accessToken, refreshToken });
});

authRoute.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw createError.BadRequest();
    }
    const userId = await verifyRefreshToken(refreshToken);

    const accessToken = await signAccessToken(userId);
    const refreshToken2 = await signRefreshToken(userId);
    res.send({ accessToken, refreshToken: refreshToken2 });
  } catch (err) {
    next(err);
  }
});

authRoute.delete("/logout", async (req, res, next) => {
  try {
    const {refreshToken} = req.body
    if (!refreshToken) {
      throw createError.BadRequest()
    }
    const userId = await verifyRefreshToken(refreshToken)
  } catch (err) {
    next(err)
  }
});
