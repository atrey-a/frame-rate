import express from 'express'
const app = express()
import mongoose from 'mongoose'
mongoose.set('strictQuery',true)
import dotenv from 'dotenv'
dotenv.config()

//Import Routes
import {authRoute} from './routes/auth.js'
import {postRoute} from './routes/posts.js'

//connect to db
mongoose.connect(process.env.DB_CONNECT, () => {
  console.log("Connected to DB!")
})

//Middleware
app.use(express.json())

//Route Middlewares
app.use('/api/user', authRoute)
app.use('/api/posts',postRoute)


app.listen(3000, () => {
  console.log("Server Up and Running!")
})