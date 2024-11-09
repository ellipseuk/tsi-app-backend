import 'dotenv/config';
import fetch from 'node-fetch';

const AUTHENTICATION_URL = process.env.AUTH_URL;

export const authenticateUser = async (req, res) => {
    if (!AUTHENTICATION_URL) {
        console.error('Authentication URL is not defined');
        return res.status(500).json({ error: 'Internal server error. Authentication URL is missing.' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const userCredentials = { username, password };

    const fetchOptions = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(userCredentials)
    };

    try {
        const authResponse = await fetch(AUTHENTICATION_URL, fetchOptions);
        const { status } = authResponse;

        if (status === 401) {
            return res.status(401).json({ error: 'Incorrect username or password. Please try again.' });
        } else if (status === 400) {
            return res.status(400).json({ error: 'Bad request. Please check the data format and try again.' });
        } else if (status >= 500) {
            return res.status(500).json({ error: 'Server error. Please try again later.' });
        } else if (status !== 200) {
            return res.status(status).json({ error: 'An unexpected error occurred. Please try again.' });
        }

        const userProfile = await authResponse.json();
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