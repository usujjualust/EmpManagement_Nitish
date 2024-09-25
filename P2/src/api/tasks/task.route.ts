import { Request, Response } from 'express';
import { Router } from 'express';

const taskRouter = Router();

taskRouter.get('/', (req: Request, res: Response) => {
  res.send('hello from Employee-tasks');
});

export default taskRouter;
