'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Questions', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'multiple-choice'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Questions', 'type');
  }
};