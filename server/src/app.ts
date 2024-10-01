import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import adminRouter from './routes/admin.route';
import eRouter from './trash/emp.route.js';
import storeRouter from './routes/store.route';

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/admin', adminRouter); //mount
app.use('/store',storeRouter)
app.use('/emp', eRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  res.send(err.message);
  next();
});

export { app };
