const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/exports_api',
    migrations: {
      directory: path.resolve(__dirname, './migrations'),
    },
    seeds: {
      directory: './seeds',
    },
  },
  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL || 'postgres://localhost/test_exports_api',
    migrations: {
      directory: path.resolve(__dirname, './migrations'),
    },
    seeds: {
      directory: './seeds',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.resolve(__dirname, './migrations'),
    },
    seeds: {
      directory: './seeds',
    },
    pool: { min: Number(process.env.DB_POOL_MIN) || 2, max: Number(process.env.DB_POOL_MAX) || 5 },
  },
};
