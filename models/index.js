// models/index.js
const sequelize = require('../config/sequelize');
const Company = require('./Company');
const Employer = require('./Employer'); // ✅ Changed from User
const Assessment = require('./Assessment');
const Question = require('./Question');
const Recommendation = require('./Recommendation');

// An Employer must belong to a Company.
Company.hasMany(Employer, { foreignKey: 'companyId' });
Employer.belongsTo(Company, { foreignKey: 'companyId' });

// An anonymous Assessment belongs to a Company.
Company.hasMany(Assessment, { foreignKey: 'companyId' });
Assessment.belongsTo(Company, { foreignKey: 'companyId' });

const db = {
  sequelize,
  Sequelize: require('sequelize'),
  Company,
  Employer, // ✅ Changed from User
  Assessment,
  Question,
  Recommendation,
};

module.exports = db;