import { config } from 'dotenv';

config();

import { connect as connectDb } from './db';
import { createApp } from './app';

const port = process.env.PORT || 3000;

const app = createApp();

connectDb();

app.listen(port, () => {
  console.log('info', `app is listening on port ${port}`, 'application');
});

process
  .on('unhandledRejection', (reason, p) => {
    console.log('error', reason, 'unhandledRejection');
  })
  .on('uncaughtException', err => {
    console.log('error', err, 'uncaughtException');
    process.exit(1);
  });
