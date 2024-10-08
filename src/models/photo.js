'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Photo.belongsTo(models.Project)
      Photo.belongsTo(models.File)
    }
  }
  Photo.init({
    
  }, {
    sequelize,
    modelName: 'Photo',
    tableName: 'photo',
    timestamps: false,
    name: {
      singular: 'photo',
      plural: 'photos'
    },
  });
  return Photo;
};