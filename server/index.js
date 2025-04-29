const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookiesParser = require('cookie-parser');
const { app, server } = require('./socket/index');
const path = require('path');

const PORT = process.env.PORT || 8080; // 🛠️ moved to top

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookiesParser());

// Serve static files (React build)
app.use(express.static(path.join(__dirname, '../client/build')));

// API endpoints
app.use('/api', router);

// Root endpoint
app.get('/', (request, response) => {
    response.json({
        message: 'server is up and running ' + PORT
    });
});

//  This must be after your API routes
// Catch-all handler to serve React for any unknown route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log('error', error);
});
