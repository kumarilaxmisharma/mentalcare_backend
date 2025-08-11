const { Company, sequelize } = require('./models');

async function createCompany() {
  try {
    await sequelize.sync(); // Make sure the table exists

    const newCompany = await Company.create({ name: 'Innovate Inc.' });

    console.log('✅ Company created successfully!');
    console.log('Use this ID for Postman:', newCompany.id);

  } catch (error) {
    console.error('❌ Error creating company:', error);
  } finally {
    // Close the database connection so the script exits
    await sequelize.close();
  }
}

createCompany();