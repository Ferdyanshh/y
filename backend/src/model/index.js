const sequelize = require('../config/db');
const User = require('./user');
const WeightLog = require('./weightLog');

module.exports = { sequelize, User, WeightLog };
