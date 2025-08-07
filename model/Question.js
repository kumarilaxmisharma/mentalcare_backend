// models/Question.js
const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');

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
});

module.exports = Question;