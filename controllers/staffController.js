import fs from 'fs';
import path from 'path';

const dataPath = path.resolve('data/staff_data.json');

export const getAllStaff = (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to load data' });
        }
        res.json(JSON.parse(data));
    });
};

export const getStaffByName = (req, res) => {
    const staffName = req.params.name;
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to load data' });
        }
        const staff = JSON.parse(data).find(
            (person) => person.Name.toLowerCase() === staffName.toLowerCase()
        );
        if (staff) {
            res.json(staff);
        } else {
            res.status(404).json({ error: 'Not found' });
        }
    });
};
