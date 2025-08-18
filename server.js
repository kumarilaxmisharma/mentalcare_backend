// server.js (Corrected to use CommonJS)
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./models'); // This will now work correctly

// Import your route files
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const assessmentRoutes = require('./routes/assessments');
const dashboardRoutes = require('./routes/dashboard');
const profileRoutes = require('./routes/profile');

// Load environment variables from .env file
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// A simple root route to check if the server is running
app.get('/', (req, res) => {
  res.send('Welcome to the MentalCare API!');
});

// Mount main API routers
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
// At the bottom with your other app.use() calls
app.use('/api/profile', profileRoutes);

const PORT = process.env.API_PORT || 3000;

// Sync database and start server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});