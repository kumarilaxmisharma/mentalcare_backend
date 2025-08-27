// models/index.js
const sequelize = require('../config/sequelize');
const Company = require('./Company');
const Employer = require('./Employer'); // ✅ Changed from User
const Assessment = require('./Assessment');
const Question = require('./Question');
const Recommendation = require('./Recommendation');
const Gender = require('./Gender');
const Specialization = require('./Specialization');
const Invite = require('./Invite');

// An Employer must belong to a Company.
Company.hasMany(Employer, { foreignKey: 'companyId' });
Employer.belongsTo(Company, { foreignKey: 'companyId' });

// Define the relationship between Employer and Invite
Employer.hasMany(Invite, {foreignKey: 'employerId'});
Invite.belongsTo(Employer, {foreignKey: 'employerId'});

// An anonymous Assessment belongs to a Company.
Company.hasMany(Assessment, { foreignKey: 'companyId' });
Assessment.belongsTo(Company, { foreignKey: 'companyId' });

Assessment.belongsTo(Specialization, { foreignKey: 'specializationId' });
Specialization.hasMany(Assessment, { foreignKey: 'specializationId' });


const db = {
  sequelize,
  Sequelize: require('sequelize'),
  Company,
  Employer, // ✅ Changed from User
  Assessment,
  Question,
  Recommendation,
  Gender,
  Specialization,
  Invite
};

module.exports = db;