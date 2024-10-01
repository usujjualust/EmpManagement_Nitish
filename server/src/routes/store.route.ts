import { Router } from 'express';
import * as controllers from '../controller/store.controller';
// import checkPermission from '../middlewares/rbac.middleware'
// import { requireAuthentication } from '../middlewares/authorization';

const storeRouter = Router();

storeRouter.post('/login',controllers.storeLogin);

export default storeRouter;