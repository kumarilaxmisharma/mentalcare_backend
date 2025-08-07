// index.js
import express from 'express';

const app = express();
const API_PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from MentalCare server!');
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${API_PORT}`);
});
