import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  host: process.env.DB_MYSQL_HOST,
  port: process.env.DB_MYSQL_PORT,
  database: process.env.DB_MYSQL_NAME,
  username: process.env.DB_MYSQL_USERNAME,
  password: process.env.DB_MYSQL_PASSWORD,
  dialect: 'mysql',
  logging: false,
  define: {
    freezeTableName: true,
  },
})

// sequelize.authenticate().then(() => console.log('hello world'))
console.log('database connection')

export default sequelize