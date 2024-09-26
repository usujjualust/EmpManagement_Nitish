import { NextFunction, Request, Response } from "express"
import { asyncHandler } from "../../utilities/asyncHandler"
import { UserRegistry } from "../../models/user.model"
import { APPDATASOURCE } from "../../db"
import { UserPermissions } from "../../models/permisson.model"
 
const checkPermission = (permission:string) => {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction)=>{
            try {
                const userRole:{role: string} | null = req.body.userId ? await APPDATASOURCE.createQueryBuilder()
                                                                  .select('role')
                                                                  .from(UserRegistry, 'user')
                                                                  .where(`userId= :id`, {id: req.body.userId})
                                                                  .getOne():null                                           
            if(! userRole){
                console.error("Requested user doesnot exist")
                return res.status(404).send(`Requested user ${req.body.userId} not found`).statusMessage = 'user not found'
            } 
            const userPermissions = new UserPermissions().getPermissionByRoleName(userRole.role)
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