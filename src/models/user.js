import { DataTypes } from 'sequelize'

import sequelize from '../data/mysql/config.js'

const User = sequelize.define(
    'User',
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
)

export default User
