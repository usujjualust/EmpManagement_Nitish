import { app } from './app.js';
import 'reflect-metadata';
import { APPDATASOURCE } from './db/index.js';

const port = process.env.PORT;
// connecting to the Postgres DB via type orm
APPDATASOURCE.initialize()
  .then(() => {
    app.on('Error', (err) => {
      console.log('ERRRROROR!');
      throw err;
    });
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error while connecting to Postgres', err);
  });
