import express, { Request, Response, NextFunction } from "express";
import AdminRouter from './routes/admin.route'
import eRouter from './trash/emp.route.js'

const app = express()

app.use(express.json());


app.use('/admin', AdminRouter)  //mount
app.use('/emp', eRouter)

app.use((err:Error, req:Request, res: Response, next: NextFunction)=>{
  console.log(err.stack)
  res.send(err.message)
  next()
})

export { app }
