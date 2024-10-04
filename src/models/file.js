'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      File.hasOne(models.Project, { as: 'report' })
      File.hasOne(models.Photo, { foreignKey: 'fileId' })
      File.hasOne(models.Author, { as: 'avatar' })
    }
  }
  File.init({
    url: DataTypes.STRING,
    name: DataTypes.STRING,
    originalName: DataTypes.STRING,
    size: DataTypes.STRING,
    mimeType: DataTypes.STRING,
    storageType: DataTypes.ENUM('local', 'cloud')
  }, {
    sequelize,
    modelName: 'File',
    tableName: 'file',
    updatedAt: false,
    name: {
      singular: 'file',
      plural: 'files'
    },
  });
  return File;
};