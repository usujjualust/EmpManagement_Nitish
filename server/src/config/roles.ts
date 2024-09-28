import { Adminlevel } from "../models/admin.model"
import { UserRole } from "../models/user.model"

export type Accessrole={
    name : Exclude<UserRole,'employee'|'store'>,
    level: Adminlevel,
    permission: Array<string>
} | {
    name : Exclude<UserRole,'admin'>
    permission: Array<string>
}

export const accessRoles: Accessrole[] = [
    {
        "name": "admin",
        "level": 'limited',
        "permission": ['viewAdmin','getUsers', 'addUser']
    },
    {
        "name": "admin",
        "level": 'super',
        "permission": ['setAdminLevel', 'viewAdmin', 'getUsers', 'addUser', 'deleteUser']
    },
    {
        "name": "employee",
        'permission': [],
    },
    {
        "name": "store",
        'permission': []
    } 
]