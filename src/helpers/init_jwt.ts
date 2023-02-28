import jwt from "jsonwebtoken";
import createError from "http-errors";
import { client } from "./init_redis.js";
import { User } from "../models/User.js";

export const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_SECRET_TOKEN;
    const options = {
      expiresIn: "1h",
      issuer: "frame-rate.com",
      audience: userId,
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
        return;
      }
      resolve(token);
    });
  });
};

export const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return next(createError.Unauthorized());
  }
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, payload) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return next(createError.Unauthorized());
      }
      return next(createError.Unauthorized(err.message));
    }
    req.payload = payload;
    next();
  });
};

export const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_SECRET_TOKEN;
    const options = {
      expiresIn: "1y",
      issuer: "frame-rate.com",
      audience: userId,
    };
    jwt.sign(payload, secret, options, async (err, token) => {
      if (err) {
        console.log(err.message);
        return reject(createError.InternalServerError());
      }

      // client.set(userId, token, "EX", 365 * 24 * 60 * 60, (err, reply) => {
      //   if (err) {
      //     console.log(err.message);
      //     reject(createError.InternalServerError());
      //     return;
      //   }
      //   resolve(token);
      // });

      try {
        const user = await User.findById(userId);
        user.updateOne({ $set: { refreshToken: token } });
        resolve(token);
      } catch (err) {
        console.log(err.message);
        return reject(createError.Unauthorized());
      }
    });
  });
};

export const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken, process.env.REFRESH_SECRET_TOKEN, async (err, payload) => {
        if (err) {
          return reject(createError.Unauthorized());
        }
        const userId = payload.aud;

        // client.get(userId, (err, res) => {
        //   if (err) {
        //     console.log(err.message);
        //     reject(createError.InternalServerError());
        //     return;
        //   }
        //   if (refreshToken === res) return resolve(userId);
        //   reject(createError.Unauthorized());
        // });

        try {
          const user = await User.findById(userId);
          if (refreshToken === user.refreshToken) {
            return resolve(userId);
          }
          reject(createError.Unauthorized());
        } catch (err) {
          console.log(err.message);
          reject(createError.Unauthorized());
        }
      }
    );
  });
};
