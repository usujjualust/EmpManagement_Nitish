import Roles from "./accessRole.model"
import { Adminlevel } from "./admin.model"


export class UserPermissions {
    private permissions : Array<string>
    constructor(){
        this.permissions = []
    }
    getPermissionBy(roleName: string, level?: Adminlevel): string[] | undefined {
            if(level && roleName === 'admin'){
               return new Roles().getRoleBy('admin', level)?.permission
            }else{
                return new Roles().getRoleBy(roleName)?.permission
            }
    }
}