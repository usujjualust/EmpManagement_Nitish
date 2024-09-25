import { Router ,Request, Response} from 'express';
import { resolveInjected } from '../../shared/container';
import { EmployeeDataAccess } from '../employee/employee.dataAccess';

const reportsRouter = Router();
const employeeDataAccess = resolveInjected<EmployeeDataAccess>('EmployeeDataAccess')
reportsRouter.get('/salaries', async (req: Request, res:Response)=>{
        const allEmpl = await employeeDataAccess.getAllEmployees()
        if(allEmpl){
            const allSalaries = allEmpl.map((empl)=>({
                [empl.name]: empl.salary
            }))
            res.json(allSalaries)
        }
})

export default reportsRouter;   