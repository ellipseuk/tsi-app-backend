import express, { json } from 'express';
import authRoutes from './routes/auth.js';
import 'dotenv/config';

const app = express();

app.use(json());


app.use('/schedule', scheduleRoute); // Подключаем маршруты

const PORT = process.env.PORT || 3000; // Устанавливаем порт
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Логируем запуск сервера
});
