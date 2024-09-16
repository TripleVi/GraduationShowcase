require('dotenv').config();

module.exports = {
  'development': {
    'host': process.env.DB_MYSQL_HOST,
    'port': process.env.DB_MYSQL_PORT,
    'database': process.env.DB_MYSQL_DATABASE,
    'username': process.env.DB_MYSQL_USERNAME,
    'password': process.env.DB_MYSQL_PASSWORD,
    'dialect': 'mysql',
    'define': {
      'freezeTableName': true,
      'underscored': true,
    },
  },
  'test': {
    'username': 'root',
    'password': null,
    'database': 'database_test',
    'host': '127.0.0.1',
    'dialect': 'mysql'
  },
  'production': {
    'username': 'root',
    'password': null,
    'database': 'database_production',
    'host': '127.0.0.1',
    'dialect': 'mysql'
  }
};