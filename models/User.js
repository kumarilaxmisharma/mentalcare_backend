// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  
  

  // ... other fields like name, email, password
  role: {
    type: DataTypes.ENUM('employee', 'employer'),
    allowNull: false,
    defaultValue: 'employee'
  }
  // // In models/User.js, add this field:
  // companyId: {
  //   type: DataTypes.UUID,
  //   allowNull: false,
  // } 


});

module.exports = User;