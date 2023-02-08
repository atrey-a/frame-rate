import Router from 'express'
export const postRoute = Router.Router();
import {verify} from './verifyToken.js'

postRoute.get('/',verify, (req,res) => {
  res.send(req.user)
})