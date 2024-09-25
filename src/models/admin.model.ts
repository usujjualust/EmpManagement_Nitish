import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Like,
  Equal,
} from 'typeorm';
import { UserRegistry } from './user.model';
import { AppDataSource } from '../db';

export type Admin_Level = 'limited' | 'super';

export type Admin = {
  _id?: string;
  admin_id: string;
  full_name: string;
  email: string;
  password_hash: string;
  phone?: string;
  level?: Admin_Level;
  last_login?: Date;
  created_at?: Date;
};

@Entity({ name: 'Admin_Table', schema: 'Admin' })
export class AdminTable extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column({
    unique: true,
  })
  admin_id!: string;

  @Column({
    nullable: false,
  })
  full_name!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column({
    nullable: true,
  })
  phone?: string;

  @Column()
  password_hash!: string;

  @Column({
    type: 'enum',
    enum: ['limited', 'super'],
    default: 'limited',
  })
  level?: Admin_Level;

  @CreateDateColumn()
  created_at!: Date;

  @CreateDateColumn()
  last_login!: Date;

  // function to load admin entries into the admin table automatically when a get request is sent to '...admins/viewAdmins' route
  static async LoadAdminsFromUserRegistry(): Promise<void> {
    console.log('adding admins from UserRegistry');
    const admins: UserRegistry[] = await AppDataSource.getRepository(UserRegistry).findBy({
      user_id: Like('USR%'),
      role: Equal('admin'),
    });
    console.log(admins);
    if (admins.length === 0) {
      throw new Error('No Admin Error');
    }

    for (const admin of admins) {
      const { user_id, ...rest } = admin;

      const existingAdmin = await AdminTable.findOne({
        where: { admin_id: user_id },
      });

      if (!existingAdmin) {
        await AdminTable.create({
          ...rest,
          admin_id: user_id,
          level: 'limited',
          phone: '',
        }).save();
      }
    }

    Object.assign(new AdminTable(), admins);
  }
}
