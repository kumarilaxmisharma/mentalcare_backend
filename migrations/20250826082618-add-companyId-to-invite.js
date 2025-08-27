module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Invites', 'companyId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Invites', 'companyId');
  }
};