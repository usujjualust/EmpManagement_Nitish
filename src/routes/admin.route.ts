import { Router } from 'express';
import * as controllers from '../controller/admin.controller';

const AdminRouter = Router();

// routes specific to admin
AdminRouter.post('/setAdminLevel', controllers.SetAdminLevel);
AdminRouter.get('/viewAdmin', controllers.GetAdmin);

// user Registery routes concerning all users, should be accessed only by admins
AdminRouter.get('/allUsers', controllers.GetAll);
AdminRouter.post('/addUser', controllers.RegisterUser);
AdminRouter.delete('/deleteUser', controllers.DeleteUser);

export default AdminRouter;
