const express = require('express');
const cors = require('cors'); // Импортируем cors
const scheduleRoute = require('./routes/schedule'); // Подключаем маршруты расписания

const app = express();

app.use(cors()); // Используем cors для разрешения CORS
app.use(express.json()); // Middleware для парсинга JSON

app.use('/schedule', scheduleRoute); // Подключаем маршруты

const PORT = process.env.PORT || 3000; // Устанавливаем порт
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Логируем запуск сервера
});
