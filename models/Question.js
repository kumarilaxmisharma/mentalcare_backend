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
  type: { // ✅ Add this field
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'multiple-choice'
  },
  choices: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

module.exports = Question;