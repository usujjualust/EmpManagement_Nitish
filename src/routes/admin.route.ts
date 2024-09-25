import { Router } from 'express';
import * as controllers from '../controller/admin.controller';

const adminRouter = Router();

// routes specific to admin
adminRouter.post('/setAdminLevel', controllers.setAdminLevel);
adminRouter.get('/viewAdmin', controllers.getAdmin);

// user Registery routes concerning all users, should be accessed only by admins
adminRouter.get('/allUsers', controllers.getAll);
adminRouter.post('/addUser', controllers.registerUser);
adminRouter.delete('/deleteUser', controllers.deleteUser);

export default adminRouter;
