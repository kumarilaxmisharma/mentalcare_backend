// In seed-questions.js
require('dotenv').config(); // Make sure this is at the very top
const { Question, sequelize } = require('./models');
const questionsData = require('./data/questions.json');

// This will format the data correctly
const formattedQuestions = questionsData;

async function seedQuestions() {
  try {
    // ✅ ADDED LOG: Check if environment variables are loaded
    const dbName = sequelize.config.database;
    console.log(`Attempting to connect to database: ${dbName}`);
    
    // Test the connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful.');

    console.log('Syncing Question table...');
    await Question.sync({ force: true }); // Using force: true to clear the table first
    console.log('✅ Table synced successfully.');

    // ✅ ADDED LOG: Check how many items we are about to insert
    console.log(`Attempting to insert ${formattedQuestions.length} questions...`);

    // The bulk create operation
    await Question.bulkCreate(formattedQuestions);

    console.log('✅ Successfully seeded the Questions table.');

    // ✅ ADDED LOG: Verify the data was saved
    const count = await Question.count();
    console.log(`✅ Verification complete. Found ${count} questions in the database.`);

  } catch (error) {
    console.error('❌ An error occurred during the seeding process:', error);
  } finally {
    console.log('Closing database connection.');
    await sequelize.close();
  }
}

seedQuestions();