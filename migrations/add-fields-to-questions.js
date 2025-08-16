'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the 'type' column
    await queryInterface.addColumn('Questions', 'type', {
      type: Sequelize.STRING,
      allowNull: true, // Or false if every question has a type
    });
    // Add the 'choices' column
    await queryInterface.addColumn('Questions', 'choices', {
      type: Sequelize.JSON,
      allowNull: true, // Or false if every question has choices
    });
  },

  async down(queryInterface, Sequelize) {
    // This is how to reverse the change if needed
    await queryInterface.removeColumn('Questions', 'type');
    await queryInterface.removeColumn('Questions', 'choices');
  }
};