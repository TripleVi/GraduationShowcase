'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Project)
      Comment.belongsTo(models.User, { as: 'author' })
      Comment.hasOne(models.Comment, { foreignKey: 'replyTo' })
      Comment.belongsTo(models.Comment, { foreignKey: 'replyTo' })
    }
  }
  Comment.init({
    content: DataTypes.STRING(3000),
    level: DataTypes.SMALLINT.UNSIGNED,
  }, {
    sequelize,
    modelName: 'Comment',
    name: {
      singular: 'comment',
      plural: 'comments'
    },
  });
  return Comment;
};