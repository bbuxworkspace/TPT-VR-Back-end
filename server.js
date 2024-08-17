const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const log = require('./utils/logger');
const bodyParser = require("body-parser");
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const tileRoutes = require('./routes/tileRoutes');
const roomRoutes = require('./routes/roomRoutes');
const vrRoutes = require('./routes/vrRoutes');
const softwareRoutes = require('./routes/softwareRoutes');
const voiceoverRoutes = require('./routes/voiceoverRoutes');
const testRoutes = require('./routes/testRoutes'); 
const errorMiddleware = require('./middleware/errorMiddleware');


connectDB();


const app = express();
app.use(express.json());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
})); // parse application/x-www-form-urlencoded


// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
    next();
});


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/tiles', tileRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/vr', vrRoutes);
app.use('/api/v1/software', softwareRoutes);
app.use('/api/v1/voiceover', voiceoverRoutes);
app.use('/api/v1', testRoutes);

app.get('/', (req, res) => {

  res.status(200).json({
    status: 'TPT 2024',
    message: 'Hello, welcome to the TPT VR System API!',
    timestamp: new Date().toISOString(),
  });

});


// Error handling middleware (should be the last middleware)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// In server.js
log(`Server is running on port ${PORT}`);

module.exports = app;  // Export app for testing