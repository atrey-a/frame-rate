import Router from 'express'
export const authRoute = Router.Router();
import {User} from '../model/User.js'
import { registerValidation, loginValidation } from '../validation.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

authRoute.post('/register', async (req,res) => {
  //Validate data before User
  const {error} = registerValidation(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  const emailExists = await User.findOne({email: req.body.email})
  if (emailExists) {
    return res.status(400).send("Email already exists")
  }

  //Hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  //Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  })
  try {
    const savedUser = await user.save()
    res.send({user: user._id})
  } catch (err) {
    res.status(400).send(err)
  }
})

authRoute.post('/login', async (req,res) => {
  const {error} = loginValidation(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }


  const user = await User.findOne({email: req.body.email})
  if (!user) {
    return res.status(400).send("Email/Password is wrong")
  }

  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) {
    return res.status(400).send("Email/Password is wrong")
  }

  const token = jwt.sign({_id: user._id}, process.env.SECRET_TOKEN)
  res.header('auth-token',token).send(token)


})
