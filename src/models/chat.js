'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chat.belongsTo(models.User)
      Chat.hasMany(models.Message)
    }
  }
  Chat.init({
    title: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Chat',
    tableName: 'chat',
    name: {
      singular: 'chat',
      plural: 'chats'
    },
    timestamps: false,
  });
  return Chat;
};