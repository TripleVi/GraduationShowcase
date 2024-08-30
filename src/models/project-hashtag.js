'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectHashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectHashtag.belongsTo(models.Project, { foreignKey: 'projectId' })
      ProjectHashtag.belongsTo(models.Hashtag, { foreignKey: 'hashtagId' })
    }
  }
  ProjectHashtag.init({
    project_id: DataTypes.INTEGER,
    hashtag_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProjectHashtag',
    timestamps: false,
  });
  return ProjectHashtag;
};