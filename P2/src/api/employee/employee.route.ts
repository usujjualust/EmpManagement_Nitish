import { Request, Response } from 'express';
import { Router } from 'express';
import * as handlers from './employee.handler';
import { validateAsEmployee } from './ZODvalidator';

const employeeRouter = Router();

employeeRouter.get('/', handlers.getAll);
employeeRouter.get('/:id', handlers.getById);
employeeRouter.post('/', validateAsEmployee, handlers.addEmployee);
// employeeRouter.put('/', ((req:Request, res:Response)=>{
//    res.send('hello from Employee')
// }))

export default employeeRouter;
