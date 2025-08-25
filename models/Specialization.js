// models/Specialization.js

// Use this if your project uses CommonJS (require/module.exports)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Adjust path if needed

const Specialization = sequelize.define('Specialization', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Specialization;