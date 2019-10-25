const config = require('dotenv').config;
config();

require('ts-node').register({
  project: './tsconfig.test.json',
});
