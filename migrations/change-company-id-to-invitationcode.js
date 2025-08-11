'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Companies', 'inviteCode', {
      type: Sequelize.UUID
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Companies', 'inviteCode', {
      type: Sequelize.STRING
    });
  }
};