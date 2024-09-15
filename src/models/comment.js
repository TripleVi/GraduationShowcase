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
      Comment.belongsTo(models.Comment, { as: 'parent' })
    }
  }
  Comment.init({
    content: DataTypes.STRING(3000),
    location: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comment',
    name: {
      singular: 'comment',
      plural: 'comments'
    },
  });
  return Comment;
};