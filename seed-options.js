const db = require('./models');

const seedOptions = async () => {
  try {
    console.log('Seeding specializations and genders...');

    // Force sync to recreate the table
    await db.Specialization.sync({ force: true });
    await db.Gender.sync({ force: true });

    // Seed Specializations
    await db.Specialization.bulkCreate([
      { name: 'Core Product & Enginnering' },
      { name: 'Infrastructure & Operation' },
      { name: 'Data & Analytic' },
      { name: 'Security & Support' },
    ]);
    console.log('✅ Specializations seeded successfully!');

    // Seed Genders
    await db.Gender.bulkCreate([
      { name: 'Female' },
      { name: 'Male' },
      { name: 'Non-Binary' },
    ]);
    console.log('✅ Genders seeded successfully!');

    console.log('Finished seeding options.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding options:', error);
    process.exit(1);
  }
};

seedOptions();