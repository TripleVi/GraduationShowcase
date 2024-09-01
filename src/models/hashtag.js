'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hashtag.belongsToMany(models.Project, { through: models.ProjectHashtag })
    }
  }
  Hashtag.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Hashtag',
    updatedAt: false,
    name: {
      singular: 'hashtag',
      plural: 'hashtags'
    },
  });
  return Hashtag;
};