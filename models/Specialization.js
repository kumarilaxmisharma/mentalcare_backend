// models/Specialization.js

// Use this if your project uses CommonJS (require/module.exports)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Adjust path if needed

const Specialization = sequelize.define('Specialization', {
  name: {
    type: DataTypes.ENUM(
      'Core Product & Enginnering', 
      'Infrastructure & Operation', 
      'Data & Analytic', 
      'Security & Support'),
    allowNull: false,
  }
  },{ 
  tableName: 'Specializations',

});


module.exports = Specialization;