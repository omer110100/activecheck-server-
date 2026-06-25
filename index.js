require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const corsMiddleware = require('./middleware/cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(corsMiddleware);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/users', require('./routers/usersRouter'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
  });
