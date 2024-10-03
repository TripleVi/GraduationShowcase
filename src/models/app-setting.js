'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AppSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AppSetting.init({
    type: DataTypes.STRING,
    value: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'AppSetting',
    tableName: 'app_setting',
  });
  return AppSetting;
};