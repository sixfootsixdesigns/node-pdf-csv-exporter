import * as knex from 'knex';
import * as knexConfig from './knexfile';

let connection;
const env = process.env.NODE_ENV;
const dbConfig = knexConfig[env];

export const connect = () => {
  if (!connection) {
    connection = knex(dbConfig);
  }
  return connection;
};

export const destroy = async () => {
  if (connection) {
    await connection.destroy();
    connection = null;
  }
};
