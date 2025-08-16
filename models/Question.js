// models/Question.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  choices: {
    type: DataTypes.JSON, // This stores the array of choices
    allowNull: false,
  },
});

module.exports = Question;