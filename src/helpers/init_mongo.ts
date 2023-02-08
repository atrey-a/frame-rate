import mongoose, { mongo } from "mongoose";
mongoose.set("strictQuery", true);
import dotenv from 'dotenv'
dotenv.config()

//connect to db
try {
  mongoose.connect(process.env.DB_CONNECT, () => {
    console.log("Connected to MongoDB!");
  });
} catch (err) {
  console.log(err.message)
}

mongoose.connection.on('connected', () => {
  console.log("Mongoose connected to DB!")
})

mongoose.connection.on('error', (err) => {
  console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log("\nMongoose disconnected!")
})

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0)
})