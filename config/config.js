require('dotenv').config();

module.exports = {
  development: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'almas689',
    database: process.env.MYSQL_DBNAME || 'todo4',
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || '3306',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: 'null',
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: 'null',
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
