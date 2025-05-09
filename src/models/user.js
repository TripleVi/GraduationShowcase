'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role)
      User.hasMany(models.Comment, { foreignKey: 'authorId' })
      User.hasMany(models.Chat)
    }
  }
  User.init({
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    avatarUrl: DataTypes.STRING,
    password: DataTypes.STRING,
    deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    name: {
      singular: 'user',
      plural: 'users'
    },
  });
  return User;
};