import { Router } from 'express';
import * as controllers from '../controller/admin.controller';
import checkPermission from '../middlewares/rbac.middleware'
import { requireAuthentication } from '../middlewares/authorization';
const adminRouter = Router();

// routes specific to admin
adminRouter.post('/setAdminLevel',requireAuthentication,checkPermission('setAdminLevel'),controllers.setAdminLevel);
adminRouter.get('/viewAdmins', requireAuthentication,controllers.getAdmins);
adminRouter.post('/login',controllers.adminLogin)

// user Registery routes concerning all users, should be accessed only by admins
adminRouter.get('/allUsers', controllers.getAll);
adminRouter.post('/addUser', controllers.registerUser);
adminRouter.delete('/deleteUser', controllers.deleteUser);

//to store
adminRouter.get('/viewStores', controllers.getStores);


export default adminRouter;
