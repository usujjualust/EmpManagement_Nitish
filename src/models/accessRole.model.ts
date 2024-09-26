import { Accessrole, accessRoles } from "../config/roles"

export default class Roles {
    private roles: Accessrole[]
    constructor(){
        this.roles = accessRoles
    }

    public getRoleByName(name:string): Accessrole| undefined {
        return this.roles.find((role)=> role.name === name);
    }

    getRoles(): Accessrole[] {
        return this.roles;
    }
}


