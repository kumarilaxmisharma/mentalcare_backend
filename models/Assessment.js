// models/Assessment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');


const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  answers: {
    type: DataTypes.JSON, // Stores the array of 18 answers
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  riskLevel: {
  type: DataTypes.STRING, // Defaults to VARCHAR(255), which is plenty of space
  allowNull: false
  },

  //Add on questions in order to 
  specialization: { // <-- Renamed
    type: DataTypes.ENUM('Core Product & Enginnering', 'Infrastructure & Operation', 'Data & Analytic', 'Security & Support'),
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
 
});



module.exports = Assessment;