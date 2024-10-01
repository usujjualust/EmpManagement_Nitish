// import Pool from "pg-pool";
// PostgreSQL connection Pool is nothing
// but cached database connections created and maintained
// to get reused for coming requests instead of
// making the new connection every time.
// const pool = new Pool({
//     user: process.env.POSTGRES_USER,
//     host: process.env.POSTGRES_HOST,
//     database: process.env.POSTGRES_DB,
//     password: process.env.POSTGRES_PASSWORD,
//     port: process.env.POSTGRES_PORT,
//     idleTimeoutMillis: 300
// });

import { DataSource } from 'typeorm';
import { UserRegistry } from '../models/user.model';
import { AdminTable } from '../models/admin.model';
import { StoreTable } from '../models/store.model';

const APPDATASOURCE = new DataSource({
  type: 'postgres',
  username: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  synchronize: true,
  logging: true,
  connectTimeoutMS: 300,
  entities: [UserRegistry, AdminTable, StoreTable],
});

export { APPDATASOURCE };
