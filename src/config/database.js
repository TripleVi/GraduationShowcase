require('dotenv').config();

module.exports = {
  'development': {
    'host': process.env.DB_HOST,
    'port': process.env.DB_PORT,
    'database': process.env.DB_DATABASE,
    'username': process.env.DB_USERNAME,
    'password': process.env.DB_PASSWORD,
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
    'dialect': 'mysql',
    'logging': false,
    'define': {
      'freezeTableName': true,
      'underscored': true,
    },
  }
};