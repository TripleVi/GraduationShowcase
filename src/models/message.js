'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.Chat)
    }
  }
  Message.init({
    content: DataTypes.TEXT,
    sender: DataTypes.ENUM('user', 'assistant')
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'message',
    name: {
      singular: 'message',
      plural: 'messages'
    },
  });
  return Message;
};