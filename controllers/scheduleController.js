import axios from 'axios';
import xml2js from 'xml2js'; // Импортируем xml2js
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, getUnixTime } from 'date-fns';

const convertToUnixTimestamp = (timeFrame) => {
    const now = new Date();

    switch (timeFrame) {
        case 'day':
            return {
                from: getUnixTime(startOfDay(now)),
                to: getUnixTime(endOfDay(now)),
            };
        case 'week':
            return {
                from: getUnixTime(startOfWeek(now)),
                to: getUnixTime(endOfWeek(now)),
            };
        case 'month':
            return {
                from: getUnixTime(startOfMonth(now)),
                to: getUnixTime(endOfMonth(now)),
            };
        default:
            throw new Error("Invalid time frame");
    }
};

// Экспортируем функцию как default
export const getSchedule = async (req, res) => {
    const { timeFrame = 'day', teachers = '', rooms = '', group_id = '', lang = 'en' } = req.body; 

   

    let from, to;
    try {
        const { from: unixFrom, to: unixTo } = convertToUnixTimestamp(timeFrame);
        from = unixFrom;
        to = unixTo;
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    const url = `https://services.tsi.lv/schedule/api/service.asmx/GetLocalizedEvents?from=${from}&to=${to}&teachers=${teachers}&rooms=${rooms}&groups=${group_id}&lang=${lang}`;
    const headers = {
        "Accept": "text/plain",
        "Content-Type": "text/plain",
        "Connection": "keep-alive",
        "Accept-Encoding": "gzip"
    };

    try {
        const response = await axios.get(url, { headers });
        
        // Преобразование XML ответа в JSON
        const parser = new xml2js.Parser();
        parser.parseString(response.data, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Failed to parse XML" });
            }

            // Доступ к JSON данным
            const eventsData = result.string; // Здесь вы получите ваш JSON объект
            res.json(eventsData);
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch schedule" });
    }
};

export default getSchedule; // Экспортируйте функцию по умолчанию
