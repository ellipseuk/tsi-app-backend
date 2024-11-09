import 'dotenv/config';
import fetch from 'node-fetch';

const authenticateURL = process.env.AUTH_URL;

export const authentication = async (req, res) => {
    const { username, password } = req.body;

    const credentials = {
        username,
        password
    };

    const authenticateRequest = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(credentials)
    };

    try {
        const response = await fetch(authenticateURL, authenticateRequest);
        const { status } = response;

        if (status === 401) {
            return res.status(401).json({ error: 'Incorrect username or password. Please try again.' });
        } else if (status === 400) {
            return res.status(400).json({ error: 'Bad request. Please check the data format and try again.' });
        } else if (status >= 500) {
            return res.status(500).json({ error: 'Server error. Please try again later.' });
        } else if (status !== 200) {
            return res.status(status).json({ error: 'An unexpected error occurred. Please try again.' });
        }

        const userProfile = await response.json();
        return res.status(200).json(userProfile);
        
    } catch (error) {
        if (error.name === 'FetchError') {
            console.error('Network error:', error.message);
            return res.status(503).json({ error: 'Service unavailable. Please check your network and try again.' });
        } else {
            console.error('Unexpected error:', error.message);
            return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
        }
    }
};
