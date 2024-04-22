require('dotenv').config();

module.exports = {
  "development": {
    "username": "postgres",
    "password": process.env.DEV_DB_PASSWORD,
    "database": process.env.DEV_DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "port": process.env.DB_PORT
  },
  "test": {
    "username": "postgres",
    "password": process.env.TEST_DB_PASSWORD,
    "database": process.env.TEST_DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "port": process.env.DB_PORT
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.PROD_DB_PASSWORD,
    "database": process.env.PROD_DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "port": process.env.DB_PORT
  }
};
