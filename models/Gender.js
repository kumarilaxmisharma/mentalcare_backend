// models/Gender.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.js');

const Gender = sequelize.define('Gender', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Gender;