import { NextFunction, Request, Response } from "express"
import { asyncHandler } from "../../utilities/asyncHandler"
import { User, UserRegistry } from "../../models/user.model"
import { UserPermissions } from "../../models/permisson.model"
import { AdminTable,  } from "../../models/admin.model"

 
const checkPermission = (permission:string) => {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction)=>{
            try {
                const userRole: User | null = req.body.user_id ? await UserRegistry.createQueryBuilder('user')
                                                        .where('user.user_id = :user_id', { user_id: req.body.user_id })
                                                        .getOne():null;                                        
            if(! userRole){
                console.error("Requested user doesnot exist")
                return res.status(404).send(`Requested user ${req.body.user_id} not found`).statusMessage = 'user not found'
            } 
            let userPermissions: string[] | undefined;
            if(userRole.role === 'admin'){
                const admin = await AdminTable.createQueryBuilder('admin')
                                    .where(`admin_id = :user_id`, {user_id : userRole.user_id})
                                    .getOne()

                userPermissions = new UserPermissions().getPermissionBy('admin',admin?.level )
            }else{
                userPermissions = new UserPermissions().getPermissionBy(userRole.role)
            }                    
            if(userPermissions?.includes(permission)){
                return next()
            }else{
                return res.status(403).json({ error: 'Access denied' });
            }
            } catch (error) {
                console.error('internal server error');
                res.status(500).statusMessage = 'Internal server error';
                next(error);
            }

    })
}

export default checkPermission;