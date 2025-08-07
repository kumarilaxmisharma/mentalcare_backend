// models/index.js
const sequelize = require('../config/sequelize');
const Employee = require('./Employee');
const Assessment = require('./Assessment');
const Question = require('./Question');
const Recommendation = require('./Recommendation');
const Company = require('./Company');
// const User = require ('./User');

// Define Relationships remove this line
// Employee.hasMany(Assessment, { foreignKey: 'employeeId' });
// Assessment.belongsTo(Employee, { foreignKey: 'employeeId' });

const db = {
  sequelize,
  Sequelize: require('sequelize'),
  Employee,
  Assessment,
  Question,
  Recommendation,
  Company,
  // User,
};

module.exports = db;