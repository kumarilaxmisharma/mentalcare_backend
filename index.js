// index.js

import express from 'express';

const app = express();
const API_PORT = 3000; // You defined the port number here

app.get('/', (req, res) => {
  res.send('Hello from MentalCare server!');
});

// ✅ Use the correct variable name here
app.listen(API_PORT, () => {
  console.log(`✅ Server is running on http://localhost:${API_PORT}`);
});