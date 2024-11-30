'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.belongsTo(models.Topic)
      Project.belongsTo(models.File, { as: 'report' })
      Project.belongsTo(models.File, { as: 'thumbnail' })
      Project.hasMany(models.Author)
      Project.hasMany(models.Photo)
      Project.belongsToMany(models.Hashtag, { through: models.ProjectHashtag })
      Project.hasMany(models.Comment)
    }
  }
  Project.init({
    title: DataTypes.STRING,
    description: DataTypes.JSON,
    year: DataTypes.SMALLINT.UNSIGNED,
    videoId: DataTypes.STRING,
    views: DataTypes.INTEGER.UNSIGNED,
    likes: DataTypes.INTEGER.UNSIGNED
  }, {
    sequelize,
    modelName: 'Project',
    name: {
      singular: 'project',
      plural: 'projects'
    },
    tableName: 'project',
    indexes: [
      {
        name: 'project_title',
        type: 'FULLTEXT',
        fields: ['title'],
      },
      {
        name: 'project_year',
        using: 'BTREE',
        fields: ['year'],
      }
    ],
  });
  return Project;
};