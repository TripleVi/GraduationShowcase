import { DataTypes, Sequelize } from 'sequelize'

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
    underscored: true,
  },
})

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    
  },
  name: {
    type: DataTypes.STRING,
  },
}, {omitNull, initialAutoIncrement: false})

const user = await User.bulkCreate([], {include}).create({paranoid})
User.destroy({where:{}})