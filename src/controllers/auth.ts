import Router from "express";
export const authRoute = Router.Router();
import { User } from "../models/User.js";
import {
  registerValidation,
  loginValidation,
} from "../helpers/validation_helper.js";
import bcrypt from "bcryptjs";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../helpers/init_jwt.js";
import createError from "http-errors";
import { client } from "../helpers/init_redis.js";

authRoute.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).send("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    const userEmail = await savedUser.email;

    client.set("u "+userEmail, JSON.stringify(user), "EX", process.env.CACHING_LIMIT, (err, reply) => {
      if (err) {
        console.log(err.message);
        return (createError.InternalServerError());
      }
      console.log("Saved user to Redis.");
    });

    res.send({ user });
  } catch (err) {
    res.status(400).send(err);
  }
});

authRoute.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    client.get("u "+req.body.email, async (err, resp) => {
      if (err || !resp) {
        // console.log(err.message);
        console.log("Retrieved user from MongoDB.");
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
        await user.updateOne({ $set: { refreshToken: refreshToken } });
        client.set("u "+user.email, JSON.stringify(user), "EX", process.env.CACHING_LIMIT, (err, reply) => {
          if (err) {
            console.log(err.message);
            return (createError.InternalServerError());
          }
          console.log("Saved user to Redis.");
        });
        res.send({ user, accessToken, refreshToken });
      } else {
        console.log("Retrieved user from Redis.");
        const user = JSON.parse(resp);
        // console.log((user));
        
        const isValidPass = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPass) {
          return res.status(400).send("Email/Password is wrong");
        }
        const accessToken = await signAccessToken(user._id);
        const refreshToken = await signRefreshToken(user._id);
        const savedUser = new User(user);
        await savedUser.updateOne({ $set: { refreshToken: refreshToken } });
        await savedUser.save()
        res.send({ user, accessToken, refreshToken });
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err);
  }
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
    const user = await User.findById(userId)
    await user.updateOne({$set: {refreshToken: refreshToken2}})

    client.set("u "+user.email, JSON.stringify(user), "EX", process.env.CACHING_LIMIT, (err, reply) => {
      if (err) {
        console.log(err.message);
        return (createError.InternalServerError());
      }
      console.log("Saved user to Redis.");
    });

    res.send({ accessToken, refreshToken: refreshToken2 });
  } catch (err) {
    next(err);
  }
});

authRoute.delete("/logout", verifyAccessToken, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw createError.BadRequest();
    }
    const userId = await verifyRefreshToken(refreshToken);
    
    // client.del(userId, (err, val) => {
    //   if (err) {
    //     console.log(err.message);
    //     throw createError.InternalServerError();
    //   }
    //   if (val == 1) {
    //     console.log(`Logged out user with userID: ${userId}`);
    //     res.sendStatus(204);
    //   } else if (val == 0) {
    //     console.log("Unauthorized");
    //     res.sendStatus(401);
    //   }
    // });
  } catch (err) {
    next(err);
  }
});
