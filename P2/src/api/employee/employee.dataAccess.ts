import { MyDb } from "../../db/sudoDb";
import { Employee } from "./employee.model";

export class EmployeeDataAccess {
    private employeeDataBase = new MyDb<Employee> ();

    public async addEmployee(empl: Employee){
        empl.employedAt = new Date();
        const id =  await this.employeeDataBase.insert(empl)
        return id
    }

    public async getEmployeeByID(id: string) {
        const employee = await this.employeeDataBase.getBy('id', id);
        return employee
    }

    public async getAllEmployees(){
        return this.employeeDataBase.getAllElements();
    }
}