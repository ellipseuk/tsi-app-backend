import express, { json } from 'express';
import authRoutes from './routes/auth.js';
import 'dotenv/config';

const app = express();

app.use(json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});