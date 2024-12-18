import dotenv from 'dotenv';
dotenv.config(); 

import express, { json } from 'express';

import newsRoutes from './routes/news.js';
import eventsRoutes from './routes/events.js';
import staffRoutes from './routes/staff.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(json());

app.use('/api', newsRoutes);
app.use('/api', eventsRoutes);
app.use('/api', staffRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
