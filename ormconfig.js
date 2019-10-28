require('dotenv').config();

let database = 'exports_api';
if (process.env.NODE_ENV === 'test') {
  database = process.env.TEST_DB || 'exports_test_api';
} else if (process.env.DB) {
  database = process.env.DB;
}

module.exports = {
  database,
  entities: ['src/entity/*.ts'],
  host: process.env.DB_HOST || 'localhost',
  logging: process.env.DB_LOGGING || false,
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
  synchronize: process.env.DB_SYNC || true,
  type: 'postgres',
  username: process.env.DB_USERNAME || '',
};
