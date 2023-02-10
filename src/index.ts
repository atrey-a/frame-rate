import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import "./helpers/init_mongo.js";
import createError from "http-errors";
import "./helpers/init_redis.js";

//Import Routes
import { authRoute } from "./controllers/auth.js";
import { userRoute } from "./controllers/users.js";
import { fileRoute } from "./controllers/files.js";
import { postRoute } from "./controllers/posts.js";
import { feedRoute } from "./controllers/feed.js";

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/file", fileRoute);
app.use("/post", postRoute);
app.use("/feed", feedRoute);

app.use(async (req, res, next) => {
  next(createError.NotFound("This route does not exist."));
});

app.use((err, req, res, next) => {
  res.status(err.status || req.status || 500);
  res.send({
    error: {
      status: err.status || req.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Up and Running! Port: ${PORT}`);
});
