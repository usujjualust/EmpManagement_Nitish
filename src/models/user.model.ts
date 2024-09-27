import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as argon2 from 'argon2';

export type UserRole = 'admin' | 'employee' | 'store';
export type Status = 'active' | 'notice' | 'inactive';

export type User = {
  _id?: string;
  user_id: string;
  full_name: string;
  email: string;
  password_hash: string;
  status: Status;
  role: UserRole;
  created_at?: Date;
};

@Entity({ name: 'User_Registry', schema: 'public' })
export class UserRegistry extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column({ unique: true })
  user_id!: string;

  @Column()
  full_name!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password_hash!: string;

  @Column({
    type: 'enum',
    enum: ['active', 'notice', 'inactive'],
    default: 'active',
  })
  status!: Status;

  @Column({
    type: 'enum',
    enum: ['admin', 'employee', 'store'],
  })
  role!: UserRole;

  @CreateDateColumn()
  created_at!: Date;

  private tempPassword: string | undefined;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    console.log('Executing before insert or update');
    if (this.tempPassword) {
      try {
        this.password_hash = await argon2.hash(this.tempPassword);
      } catch (err) {
        console.error('password not hashed', err);
      }
    }
  }
  setPassword(password: string) {
    this.tempPassword = password;
  }
  static async isPasswordCorrect(password: string, password_hash: string): Promise<boolean> {
    return await argon2.verify(password_hash, password);
  }
}
