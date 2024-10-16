const express = require('express');
const { connectDB } = require('./config/db');
const loggedinRoutes = require('./routes/loggedin');
const nonLoggedinRoutes = require('./routes/nonloggedin');
const cors = require('cors');

const app = express();
require('dotenv').config();

const DATABASE_URL = process.env.MONGODB_CONNECTION_URL;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true 
}));

connectDB(DATABASE_URL);

app.use('/api/public', nonLoggedinRoutes);

// Logged-in routes
app.use('/api/private', loggedinRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
