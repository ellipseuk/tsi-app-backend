const axios = require('axios');
const qs = require('qs');
const fs = require('fs');

const login = async (req, res) => {
  const { studentCode, password } = req.body;

  if (!studentCode || !password) {
    return res.status(400).json({ error: 'Student code and password are required' });
  }

  try {
    const loginUrl = `${process.env.MYTSI_URL}/login`;

    const loginData = qs.stringify({
      username: studentCode,
      password: password,
    });

    // Send POST request with automatic redirects disabled
    const response = await axios.post(loginUrl, loginData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        'Referer': `${process.env.MYTSI_URL}/login`,
        'Origin': process.env.MYTSI_URL,
      },
      maxRedirects: 0 // Disabling redirects to check the response
    });

    // We check based on the Location header where the request is being redirected
    const redirectLocation = response.headers.location;
    const cookies = response.headers['set-cookie'];

    if (redirectLocation === '/' && cookies) {
      // If the redirect is to `/` and cookies are set, we consider the login successful.
      fs.writeFileSync('cookies.txt', cookies.join(';'));
      res.status(200).json({ message: 'Login successful' });
    } else {
      // If redirect to `/login` then login failed
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    if (error.response && error.response.status === 302) {
      const redirectLocation = error.response.headers.location;
      const cookies = error.response.headers['set-cookie'];

      if (redirectLocation === '/' && cookies) {
        fs.writeFileSync('cookies.txt', cookies.join(';'));
        return res.status(200).json({ message: 'Login successful' });
      } else if (redirectLocation === '/login') {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { login };