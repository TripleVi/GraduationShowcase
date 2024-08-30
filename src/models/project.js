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
      Project.hasMany(models.Author, { foreignKey: 'projectId' })
      Project.belongsTo(models.Report, { foreignKey: 'reportId' })
      Project.hasMany(models.Photo, { foreignKey: 'projectId' })
      Project.belongsToMany(models.Hashtag, { through: models.ProjectHashtag })
    }
  }
  Project.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    year: DataTypes.INTEGER,
    videoId: DataTypes.STRING,
    views: DataTypes.INTEGER,
    likes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};