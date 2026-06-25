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
app.use('/api/workouts', require('./routers/workoutsRouter'));
app.use('/api/measurements', require('./routers/measurementsRouter'));
app.use('/api/requests', require('./routers/requestsRouter'));
app.use('/api/programs', require('./routers/programsRouter'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
  });
