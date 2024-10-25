
# TSI App Backend

## Prerequisites
- Node.js and npm installed

## 1. Clone the Repository
```bash
git clone https://github.com/your-username/tsi-app-backend.git
cd tsi-app-backend
```

## 2. Install Dependencies
```bash
npm install
```

## 3. Configure Environment Variables
1. Create a `.env` file in the project root.
2. Add the necessary environment variables, as shown below:

```dotenv
MYTSI_URL=https://my.tsi.lv
PORT=3000
```

## 4. Start the Server with Nodemon
```bash
npm run dev
```

## 5. Testing the Login Endpoint

### Using Postman
1. Open Postman and create a new POST request.
2. Enter the following URL:

   ```
   http://localhost:3000/api/auth/login
   ```

3. Go to the Headers tab and set `Content-Type` to `application/json`.

4. In the Body tab, choose raw and select JSON format. Add the following JSON data:

   ```json
   {
     "studentCode": "your_student_code",
     "password": "your_password"
   }
   ```

5. Send the request.

### Using curl

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"studentCode": "your_student_code", "password": "your_password"}'
```

## Expected Response
- **Successful Login:**

  ```json
  {
    "message": "Login successful"
  }
  ```

- **Invalid Credentials:**

  ```json
  {
    "message": "Invalid credentials"
  }
  ```

## 6. Additional Information
To run the server without Nodemon (e.g., in production), use:

```bash
npm run start
```

This starts the server using Node.js only, without automatic restarts.
