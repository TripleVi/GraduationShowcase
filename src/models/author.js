'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Author.belongsTo(models.Project)
      Author.belongsTo(models.File, { as: 'avatar' })
    }
  }
  Author.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Author',
    name: {
      singular: 'author',
      plural: 'authors'
    },
    tableName: 'author',
    indexes: [
      {
        name: 'project_name',
        type: 'FULLTEXT',
        fields: ['name'],
      },
    ],
  });
  return Author;
};