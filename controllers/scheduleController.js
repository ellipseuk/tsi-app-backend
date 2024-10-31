import axios from 'axios';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, getUnixTime, fromUnixTime, format } from 'date-fns';
import fs from 'fs';
import { parseStringPromise } from 'xml2js';

const API_BASE_URL = 'https://services.tsi.lv/schedule/api/service.asmx';
const TSI_DATA_FILE = 'tsi_data.json';

const getIdByName = (tsiData, category, name) => {
    const data = tsiData[category];
    return Object.keys(data).find(key => data[key].toLowerCase() === name.toLowerCase()) || '';
};

const getNameById = (tsiData, category, id) => {
    const data = tsiData[category];
    return data[id] || '';
};

const convertIdsToNames = (tsiData, events) => {
    return events.map(event => ({
        time: format(fromUnixTime(event[0]), 'HH:mm'),
        room: event[1].map(roomId => getNameById(tsiData, 'rooms', roomId)),
        groups: event[2].map(groupId => getNameById(tsiData, 'groups', groupId)),
        teacher: getNameById(tsiData, 'teachers', event[3]),
        name: event[4],
        comment: event[5],
        class: event[6]
    }));
};

const fetchTSIData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/GetItems`);
        
        const jsonString = response.data.match(/^\({"d":"(.*)"}\)$/);
        if (jsonString) {
            const tsiData = JSON.parse(jsonString[1].replace(/\\/g, ''));
            tsiData.timestamp = Math.floor(Date.now() / 1000);
            fs.writeFileSync(TSI_DATA_FILE, JSON.stringify(tsiData, null, 2));
            return tsiData;
        }

        throw new Error('Unexpected response format');
    } catch (error) {
        console.error('Error fetching TSI data:', error.message);
        return null;
    }
};

const loadTSIData = async () => {
    if (fs.existsSync(TSI_DATA_FILE)) {
        const tsiData = JSON.parse(fs.readFileSync(TSI_DATA_FILE, 'utf-8'));
        
        const oneWeekInSeconds = 7 * 24 * 60 * 60;
        if (Math.floor(Date.now() / 1000) - tsiData.timestamp > oneWeekInSeconds) {
            return await fetchTSIData();
        }
        return tsiData;
    } else {
        return await fetchTSIData();
    }
};

const convertToUnixTimestamp = (timeFrame) => {
    const now = new Date();
    switch (timeFrame) {
        case 'day':
            return { from: getUnixTime(startOfDay(now)), to: getUnixTime(endOfDay(now)) };
        case 'week':
            return { from: getUnixTime(startOfWeek(now)), to: getUnixTime(endOfWeek(now)) };
        case 'month':
            return { from: getUnixTime(startOfMonth(now)), to: getUnixTime(endOfMonth(now)) };
        default:
            throw new Error("Invalid time frame");
    }
};

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

    try {
        const tsiData = await loadTSIData();

        const teacherId = teachers ? getIdByName(tsiData, 'teachers', teachers) : '';
        const roomId = rooms ? getIdByName(tsiData, 'rooms', rooms) : '';
        const groupId = group_id ? getIdByName(tsiData, 'groups', group_id) : '';

        if (group_id && !groupId) {
            return res.status(400).json({ error: `Group '${group_id}' not found.` });
        }
        if (teachers && !teacherId) {
            return res.status(400).json({ error: `Teacher '${teachers}' not found.` });
        }
        if (rooms && !roomId) {
            return res.status(400).json({ error: `Room '${rooms}' not found.` });
        }

        const url = `${API_BASE_URL}/GetLocalizedEvents?from=${from}&to=${to}&teachers=${teacherId}&rooms=${roomId}&groups=${groupId}&lang=${lang}`;
        const headers = {
            "Accept": "text/plain",
            "Content-Type": "text/plain",
            "Connection": "keep-alive",
            "Accept-Encoding": "gzip"
        };

        const response = await axios.get(url, { headers });

        try {
            const result = await parseStringPromise(response.data);

            if (result.string && result.string._) {
                const jsonData = result.string._;
                const events = JSON.parse(jsonData);

                const eventsWithNames = convertIdsToNames(tsiData, events.events.values);

                return res.json({ keys: events.events.keys, values: eventsWithNames });
            } else {
                throw new Error("Unexpected structure in parsed XML");
            }
        } catch (xmlError) {
            console.error('Failed to parse XML:', xmlError);
            return res.status(500).json({ error: "Failed to parse schedule response", responseData: response.data });
        }

    } catch (error) {
        console.error('Failed to fetch schedule:', error.message);
        return res.status(500).json({ error: "Failed to fetch schedule" });
    }
};

export default getSchedule;