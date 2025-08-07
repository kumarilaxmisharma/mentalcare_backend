// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/sequelize');

// const User = sequelize.define('User', {
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//     validate: {
//       isEmail: true, // Adds email format validation
//     },
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   role: {
//     type: DataTypes.ENUM('employee', 'employer'),
//     allowNull: false,
//     defaultValue: 'employee',
//   },
// });

// module.exports = User;