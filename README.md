# FrameRate

Backend for an image-posting social media app. Built with Express.js and TypeScript on a Mongo database. Uses Firebase for storage and Redis for caching.

## Setup

Requirements: A running instance of Redis, a MongoDB cluster and Firebase Storage credentials. Also, npm.

Fill in the values of each variable (self-explanatory) in the `.env-sample` file and rename it to `.env`.

After that, run the following three commands:

```bash
npm install
npm run build
npm run start
```

## API Description

| Functionality | Method | Endpoint | Body | Auth | Return |
|---------------|---------|----------|------|:----:|--------|
|Register a new user|POST|`/auth/register`|\<userSchema\>|-|\<userSchema\>|
|Login a registered user|POST|`/auth/login`|\<userSchema\>|-|\<userSchema\>,\<tokens\>|
|Generate a new access token|POST|`/auth/refresh-token`|\<refreshToken\>|-|\<newTokens\>|
|Logout a user|DELETE|`/auth/logout`|\<refreshToken\>|Bearer \<accessToken\>|-|
|Follow a user|PUT|`/user/follow/{userId}`|\<userId\>|Bearer \<accessToken\>|-|
|Unfollow a user|PUT|`/user/unfollow/{userId}`|\<userId\>|Bearer \<accessToken\>|-|
|Upload an Image|POST|`/file/new`|\<userId\>|Bearer \<accessToken\>|\<imageId\>|
|Get an Image|GET|`/file/{imageId}`|\<userId\>|Bearer \<accessToken\>|\<imageUrl\>|
|Delete an Image|DELETE|`/file/{imageId}`|\<userId\>|Bearer \<accessToken\>|-|
|Create a post|POST|`/post/new`|\<postSchema\>|Bearer \<accessToken\>|\<postSchema\>|
|Delete a post|DELETE|`/post/{postId}`|\<userId\>|Bearer \<accessToken\>|-|
|Toggle like on a post|PUT|`/post/like/{postId}`|\<userId\>|Bearer \<accessToken\>|-|
|Get number of likes|GET|`/post/likes/{postId}`|\<userId\>|Bearer \<accessToken\>|\<likes\>|
|Get number of following likes|GET|`/post/flikes/{postId}`|\<userId\>|Bearer \<accessToken\>|\<likes\>|
|Toggle save on a post|PUT|`/post/save/{postId}`|\<userId\>|Bearer \<accessToken\>|-|
|Render a paginated feed|GET|`/feed/{pageIndex}`|\<userId\>|Bearer \<accessToken\>|\<feed\>|
