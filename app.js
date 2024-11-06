import express, { json } from 'express';

import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import eventsRoutes from './routes/events.js';

import 'dotenv/config';

const app = express();

app.use(json());

app.use('/api/auth', authRoutes);
app.use('/api', newsRoutes);
app.use('/api', eventsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});