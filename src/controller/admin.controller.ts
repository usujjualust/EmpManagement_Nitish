import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { asyncHandler } from '../utilities/asyncHandler';
import { UserRegistry } from '../models/user.model';
import jwt from 'jsonwebtoken';
const { verify } = jwt;
import { APPDATASOURCE } from '../db';
import { Admin, Adminlevel, AdminTable } from '../models/admin.model';
import { generateAccessToken, generateRefreshToken } from '../middlewares/authentication';


const adminLogin = asyncHandler(async (req:Request, res:Response, next:NextFunction)=>{
  try {
    const {userId, password} = req.body
    // console.log(userId, password, req.body)
    if (! userId ){
      console.error('userId is not provided')
      return res.status(400).send('user id not provided');
    }
    if (! password ){
      console.error('password is not provided')
      return res.status(400).send('password not provided');
    }
    const user: Admin | null = await AdminTable.createQueryBuilder('admin')
          .where('admin.admin_id = :admin_id',{admin_id: userId })
          .getOne();
    // console.log(password_hash)      
    if(! user){
      return res.status(404).send('Admin not found!');
    }
    const result = await UserRegistry.isPasswordCorrect(password, user.password_hash)
    if(! result){
      console.log("admin id and password donot match")
      return res.status(400).send('admin id and password donot match')
    }
    const accessToken = await generateAccessToken(user);
    let verifycode = verify (accessToken, process.env.AUTH_ACCESS_TOKEN_SECRET!,(err)=>{
      if(err){
          console.log(err);
      }});
    //console.log(verifycode);
    console.log({at: accessToken })
    const refreshToken = await generateRefreshToken(user);
    verifycode = verify (refreshToken, process.env.AUTH_REFRESH_TOKEN_SECRET!,(err)=>{
      if(err){
          console.log(err);
      } });
    console.log(verifycode);
    console.log({rt: refreshToken })
    return res.status(200).json({rt: refreshToken ,at: accessToken, msg: 'admin logged in' });

  } catch (error) {
      console.error('internal server error');
      res.status(500).statusMessage = 'Internal server error';
      next(error);
  }
})
const setAdminLevel = asyncHandler(
  async (
    req: Request<{ _id: string; admin_id: string; level: Adminlevel }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const updatedAdmin = await APPDATASOURCE.createQueryBuilder()
        .update(AdminTable)
        .set({ level: req.body.level })
        .where('_id = :_id', { _id: req.body._id })
        .andWhere('admin_id = :admin_id', { admin_id: req.body.user_id })
        .execute();
      if (updatedAdmin.affected === 0) {
        return res.status(404).send('Admin not updated!!').statusMessage = 'Not Found';
      }
      return res.status(201).send('admin level updated').json().statusMessage = 'Admin updated';
    } catch (error) {
      console.error('internal server error');
      res.status(500).statusMessage = 'Internal server error';
      next(error);
    }
  },
);
const getAdmin = asyncHandler(
  async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ) => {
  try {
    await AdminTable.loadAdminsFromUserRegistry();
    const admins: Admin[] = await AdminTable.createQueryBuilder().getMany();
    //  res.send('ok')
    if (admins.length === 0) {
      return res.status(404).send('Empty, no data found!');
    } else {
      res.status(200).json(admins);
    }
  } catch (error) {
    console.error('Error while fetching data', error);
    res.status(404).send(error);
    next(error);
  }

  // res.send("ok")
});

const getAll = asyncHandler(
  async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ) => {
  try {
    const users: User[] = await UserRegistry.createQueryBuilder('user').getMany();
    if (users.length === 0) {
      return res.status(404).send('Empty, no data found!');
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    console.error('Error while fetching data', error);
    res.status(404).send(error);
    next(error);
  }
});
const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInfo: User = req.body;

    // const existedUser = await UserRegistry.findOne({
    //     where: [
    //         { email: userInfo.email },
    //         { userId: userInfo.userId }
    //     ]
    // });
    const existedUser = await UserRegistry.createQueryBuilder('user')
      .where('user.email = :email', { email: userInfo.email })
      .orWhere('user.user_id =  :userId', { userId: userInfo.user_id })
      .getOne();

    if (existedUser) {
      // Throw an error if the user already exists
      console.log(existedUser);
      return next(new Error('User already exists'));
    }
    const newUser = new UserRegistry();
    Object.assign(newUser, userInfo);
    newUser.setPassword(userInfo.password_hash);

    const user = await APPDATASOURCE.createQueryBuilder()
      .insert()
      .into(UserRegistry)
      .values(newUser)
      .execute();
    if (newUser.role === 'admin') {
      await AdminTable.loadAdminsFromUserRegistry();
    }
    return res.status(201).json(user);
  } catch (error) {
    console.error('internal server error');
    res.status(500).statusMessage = 'Internal server error';
    next(error);
  }
});

const deleteUser = asyncHandler(
  async (
    req: Request<Array<{ userId?: string; email?: string }>>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userInfo: Array<{ userId?: string; email?: string }> = req.body;
      const deletedUser: UserRegistry[] = [];

      for (const user of userInfo) {
        if (user.email === null && user.userId === null) {
          res.status(400).send(`User id and email not provided`).statusMessage = `Invalid request`;
          throw new Error('Invalid request format');
        }
        const foundUser = await UserRegistry.createQueryBuilder('user')
          .where('user.user_id= :id', { id: user.userId })
          .orWhere('user.email= :email', { email: user.email })
          .getOne();
        console.log(foundUser);
        if (foundUser === null) {
          console.error(`User: ${user.userId} ${user.email} not found`);
          return (res
            .status(404)
            .send(`Reaquired user ${user.userId} ${user.email} not found`).statusMessage =
            `User not found`);
        }
        deletedUser.push(foundUser);
        const source = foundUser.role === 'admin'? 'AdminTable' : foundUser.role === 'employee' ? 'UserRegistry': 'UserRegistry';
        const uid = foundUser.role === 'admin'? 'admin' : null
        const status2 = await APPDATASOURCE.createQueryBuilder()
          .delete()
          .from(source)
          .where(`${uid}_id= :id`, { id: foundUser.user_id })
          .execute();
        console.log(status2);
        const status = await APPDATASOURCE.createQueryBuilder()
          .delete()
          .from(UserRegistry)
          .where('_id= :id', { id: foundUser._id })
          .execute();
        console.log(status);
       
      }
      
      if (deletedUser.length === 0) {
        return res.status(400);
      }
      return res.status(201).json({user: deletedUser,msg : 'deleted successfully'});
    } catch (error) {
      console.error('internal server error');
      res.status(500).statusMessage = 'Internal server error';
      next(error);
    }
  },
);

export { registerUser, getAll, deleteUser, getAdmin, setAdminLevel, adminLogin };
