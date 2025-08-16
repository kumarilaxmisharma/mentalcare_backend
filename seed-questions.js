const { Question, sequelize } = require('./models');
const questionsData = require('./questions.json');

async function seedQuestions() {
  try {
    console.log('Syncing database...');
    await sequelize.sync(); // Make sure the table exists

    console.log('Seeding questions...');
    // The `updateOnDuplicate` option prevents errors if you run the script multiple times.
    // It will update existing questions based on their ID.
    await Question.bulkCreate(questionsData, {
      updateOnDuplicate: ["text", "choices"] 
    });

    console.log('✅ Successfully seeded the Questions table.');
  } catch (error) {
    console.error('❌ Error seeding the database:', error);
  } finally {
    await sequelize.close();
  }
}

seedQuestions();