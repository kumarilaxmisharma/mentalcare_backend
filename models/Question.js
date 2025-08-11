// models/Question.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

// models/Question.js
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
  modelInputKey: { // ✅ Add this mapping column
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: false,
  }
});

module.exports = Question;