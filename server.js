import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './models/index.js'; // Note the .js extension is often needed

// Import your routes
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';


// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./models');

// Load environment variables
dotenv.config();

// Route files
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const assessmentRoutes = require('./routes/assessments');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/dashboard', dashboardRoutes);



const PORT = process.env.API_PORT || 5000;

// Sync database and start server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});