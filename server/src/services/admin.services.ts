import { APPDATASOURCE } from '../db';
import { Admin, AdminTable } from '../models/admin.model';
import { UserRegistry } from '../models/user.model';

const fetchAdmin = async (admin_id : string):Promise<Admin | null>  =>{
    return AdminTable.createQueryBuilder('admin')
    .where('admin.admin_id = :admin_id',{admin_id: admin_id })
    .getOne();
}

const adminUpdate = async(key : string, value: unknown, a_id: string)=>{
    return  APPDATASOURCE.createQueryBuilder()
    .update(AdminTable)
    .set({[key]: value })
    .where('admin_id = :admin_id', { admin_id: a_id })
    .execute();
}
// store table and employee table creation is pending
  
const fetchAll = async(reqKey: 'StoreTable' | 'employee' | 'AdminTable' | 'UserRegistry' ):Promise<unknown[]> => {
    return APPDATASOURCE.createQueryBuilder()
                        .select()
                        .from(reqKey, '')
                        .execute()
}

const deleteService =  async(source:'StoreTable' | 'EmployeeTable' | 'AdminTable' | 'UserRegistry', user_id : string, role?: 'admin' | 'store' | 'employee' | 'user'):Promise<unknown> => {
    return APPDATASOURCE.createQueryBuilder()
                        .delete()
                        .from(source)
                        .where(`${role}_id= :id`, { id: user_id })
                        .execute();
}
//userRegistry services

const fetchUser = async (user_id? : string, user_email?: string, _id?: string ):Promise<UserRegistry | null>  =>{
    return UserRegistry.createQueryBuilder('user')
            .where('user.user_id = :user_id',{user_id: user_id })
            .orWhere('user.email= :email', { email: user_email })
            .orWhere('user._id= :id', {id: _id})
            .getOne();
}

export { fetchAdmin, adminUpdate, fetchAll , fetchUser, deleteService};