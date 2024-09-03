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
      ProjectHashtag.belongsTo(models.Project)
      ProjectHashtag.belongsTo(models.Hashtag)
    }
  }
  ProjectHashtag.init({
    
  }, {
    sequelize,
    modelName: 'ProjectHashtag',
    tableName: 'Project_Hashtag',
    timestamps: false,
    name: {
      singular: 'projectHashtag',
      plural: 'projectHashtags'
    },
  });
  return ProjectHashtag;
};