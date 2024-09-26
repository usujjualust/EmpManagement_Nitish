import Roles from "./accessRole.model"


export class UserPermissions {
    private permissions : Array<string>
    constructor(){
        this.permissions = []
    }
    getPermissionByRoleName(roleName: string): string[] | undefined {
        return new Roles().getRoleByName(roleName)?.permission;
    }
}