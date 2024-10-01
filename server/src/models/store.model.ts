import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
    Like,
  } from 'typeorm';
import { UserRegistry } from './user.model';
import { APPDATASOURCE } from '../db';

export type StoreType = 'restaurant' | 'fastfoodjoint' | 'juicebar' | 'stationary' | ''
export type Store = {
  _id?: string;
  storeId: string;
  full_name: string;
  email: string;
  password_hash: string;
  phone?: string;
  storeType?: StoreType;
  storeLocation?: string;
  created_at?: Date;
};
@Entity({name: 'Store_Table', schema: 'Store'})
export class StoreTable extends BaseEntity  {
  @PrimaryGeneratedColumn('uuid')
  _id!: string

  @Column({
    unique : true
  })
  storeId! : string

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
    enum: ['restaurant', 'fastfoodjoint', 'stationary', 'juicebar', ''],
    default: ''
  })
  storeType!: StoreType

  @Column()
  storeLocation!: string

  @CreateDateColumn()
  created_at!: Date;

  static async loadStoresFromUserRegistry():Promise<void>{
    console.log('Adding stores from the User Registry');
    const stores : UserRegistry[] = await APPDATASOURCE.getRepository(UserRegistry).findBy(
      {
        user_id: Like('STR%'),
        role: 'store'
      }
    )

    console.log(stores)
    if (stores.length === 0){
      throw new Error('No Store Error');
    }

    for (const store of stores){
      const { user_id, ...rest} = store;

      const existingStore  = await StoreTable.findOne({
        where: {storeId : user_id},
      });
      if (! existingStore){
        await StoreTable.create(
          {
            ...rest,
            storeId : user_id,
            phone:'',
            storeType: '',
            storeLocation : ''
          }
        ).save()
      }
    
      }
      Object.assign(new StoreTable(), stores)

    }
}