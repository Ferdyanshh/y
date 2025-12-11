const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const WeightLog = sequelize.define('WeightLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  weight: { type: DataTypes.FLOAT, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: 'weight_logs',
  timestamps: true
});

User.hasMany(WeightLog, { foreignKey: 'userId', onDelete: 'CASCADE' });
WeightLog.belongsTo(User, { foreignKey: 'userId' });

module.exports = WeightLog;
