const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  current_weight: { type: DataTypes.FLOAT, defaultValue: 0 },
  target_weight: { type: DataTypes.FLOAT, defaultValue: 0 }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
