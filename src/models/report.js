'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Report.belongsTo(models.Project)
    }
  }
  Report.init({
    url: DataTypes.STRING,
    name: DataTypes.STRING,
    size: DataTypes.STRING,
    mimeType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Report',
    timestamps: false,
    name: {
      singular: 'report',
      plural: 'reports'
    },
  });
  return Report;
};