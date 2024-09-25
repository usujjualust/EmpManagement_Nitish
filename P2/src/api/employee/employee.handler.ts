//middleware

import { Request, Response, NextFunction } from 'express';
import { Employee } from './employee.model';
import { EmployeeDataAccess } from './employee.dataAccess';
import { injectDependency } from '../../shared/container';

const dataAccess = new EmployeeDataAccess();
injectDependency('EmployeeDataAccess', dataAccess);
export async function getAll(req: Request, res: Response<Array<Employee>>, next: NextFunction) {
  try {
    const allEmployees = await dataAccess.getAllEmployees();
    res.json(allEmployees);
  } catch (error) {
    next(error);
  }
}

export async function getById(
  req: Request<{ id: string }>,
  res: Response<Employee | string>,
  next: NextFunction,
) {
  try {
    const id = req.params.id;
    const employee = await dataAccess.getEmployeeByID(id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).send(`Empl with id ${id} not found`);
    }
  } catch (error) {
    next(error);
  }
}

type ObjectwithId = {
  id: string;
};

export async function addEmployee(
  req: Request<{}, ObjectwithId, Employee>,
  res: Response<ObjectwithId>,
  next: NextFunction,
) {
  try {
    const eid = await dataAccess.addEmployee(req.body);
    res.json({
      id: eid,
    });
  } catch (error) {
    next(error);
  }
}
