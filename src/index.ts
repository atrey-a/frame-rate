import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import "./helpers/init_mongo.js";
import createError from "http-errors";
import { verifyAccessToken } from "./helpers/jwt_helper.js";
import { client } from "./helpers/init_redis.js";

//Import Routes
import { authRoute } from "./routes/auth.js";
import { postRoute } from "./routes/posts.js";

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Route Middlewares
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.get("/", verifyAccessToken, async (req, res, next) => {
  res.send("Hello from Express.");
});

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
