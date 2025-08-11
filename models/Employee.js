// // models/Employee.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/sequelize');

// const Employee = sequelize.define('Employee', {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//   },
//   department: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   gender: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   password: {
//   type: DataTypes.STRING,
//   allowNull: false,
//   }
// });

// module.exports = Employee;