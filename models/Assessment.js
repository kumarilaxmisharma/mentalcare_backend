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
  specializationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Specializations', // This is the table name
      key: 'id',
    },
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  }
 
});



module.exports = Assessment;