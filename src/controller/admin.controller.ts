import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { asyncHandler } from '../utilities/asyncHandler';
import { UserRegistry } from '../models/user.model';

import { AppDataSource } from '../db';
import { Admin, Admin_Level, AdminTable } from '../models/admin.model';

const SetAdminLevel = asyncHandler(
  async (
    req: Request<{ _id: string; admin_id: string; level: Admin_Level }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const updatedAdmin = await AppDataSource.createQueryBuilder()
        .update(AdminTable)
        .set({ level: req.body.level })
        .where('_id = :_id', { _id: req.body._id })
        .andWhere('admin_id = :admin_id', { admin_id: req.body.admin_id })
        .execute();
      if (updatedAdmin.affected === 0) {
        res.status(404).send('Admin not Found!!').statusMessage = 'Not Found';
      }
      res.status(201).send('admin level updated').json().statusMessage = 'Admin updated';
    } catch (error) {
      console.error('internal server error');
      res.status(500).statusMessage = 'Internal server error';
      next(error);
    }
  },
);
const GetAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AdminTable.LoadAdminsFromUserRegistry();
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

const GetAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
const RegisterUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInfo: User = req.body;

    // const existedUser = await UserRegistry.findOne({
    //     where: [
    //         { email: userInfo.email },
    //         { user_id: userInfo.user_id }
    //     ]
    // });
    const existedUser = await UserRegistry.createQueryBuilder('user')
      .where('user.email = :email', { email: userInfo.email })
      .orWhere('user.user_id =  :user_id', { user_id: userInfo.user_id })
      .getOne();

    if (existedUser) {
      // Throw an error if the user already exists
      console.log(existedUser);
      return next(new Error('User already exists'));
    }
    const newUser = new UserRegistry();
    Object.assign(newUser, userInfo);
    newUser.setPassword(userInfo.password_hash);

    const user = await AppDataSource.createQueryBuilder()
      .insert()
      .into(UserRegistry)
      .values(newUser)
      .execute();

    return res.status(201).send('User created successfully').json(user);
  } catch (error) {
    console.error('internal server error');
    res.status(500).statusMessage = 'Internal server error';
    next(error);
  }
});

const DeleteUser = asyncHandler(
  async (
    req: Request<Array<{ user_id?: string; email?: string }>>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userInfo: Array<{ user_id?: string; email?: string }> = req.body;
      const deletedUser: UserRegistry[] = [];

      for (const user of userInfo) {
        if (user.email === null && user.user_id) {
          res.status(400).send(`User id and email not provided`).statusMessage = `Invalid request`;
          throw new Error('Invalid request format');
        }
        const foundUser = await UserRegistry.createQueryBuilder('user')
          .where('user.user_id= :id', { id: user.user_id })
          .orWhere('user.email= :email', { email: user.email })
          .getOne();
        console.log(foundUser);
        if (foundUser === null) {
          console.error(`User: ${user.user_id} ${user.email} not found`);
          return (res
            .status(404)
            .send(`Reaquired user ${user.user_id} ${user.email} not found`).statusMessage =
            `User not found`);
        }
        deletedUser.push(foundUser);
        const status = await AppDataSource.createQueryBuilder()
          .delete()
          .from(UserRegistry)
          .where('_id= :id', { id: foundUser._id })
          .execute();
        console.log(status);
      }
      if (deletedUser.length === 0) {
        return res.status(400);
      }
      return res.status(201).send('got deleted successfully').json(deletedUser);
    } catch (error) {
      console.error('internal server error');
      res.status(500).statusMessage = 'Internal server error';
      next(error);
    }
  },
);

export { RegisterUser, GetAll, DeleteUser, GetAdmin, SetAdminLevel };
