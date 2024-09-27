import { Accessrole, accessRoles } from "../config/roles"
import { Adminlevel } from "./admin.model";

export default class Roles {
    private roles: Accessrole[]
    constructor(){
        this.roles = accessRoles
    }

    public getRoleBy(name:string, level?: Adminlevel): Accessrole| undefined {
        if(name === 'admin' && level){
        return this.roles.find((role)=> (role.name === name && role.level === level));
        }else {
        return this.roles.find((role)=> (role.name === name));
        }
    }

    
    getRoles(): Accessrole[] {
        return this.roles;
    }
}


