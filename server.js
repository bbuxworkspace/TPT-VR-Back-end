const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const connectDB = require('./config/db');
const log = require('./utils/logger');


const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorMiddleware = require('./middleware/errorMiddleware'); // Adjust path if necessary

// const tileRoutes = require('./routes/tileRoutes');
// const vrRoutes = require('./routes/vrRoutes');
// const softwareRoutes = require('./routes/softwareRoutes');
// const voiceoverRoutes = require('./routes/voiceoverRoutes');
// const errorHandler = require('./middleware/errorMiddleware');


connectDB();


const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  // res.status(201).send('Hello, welcome to the TPT VR System API!');

  res.status(200).json({
    status: 'success',
    message: 'Hello, welcome to the TPT VR System API!',
    timestamp: new Date().toISOString(),
  });

  console.log("GET: /api/")
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error handling middleware (should be the last middleware)
app.use(errorMiddleware);

// app.use('/api/v1/tiles', tileRoutes);
// app.use('/api/v1/vr', vrRoutes);
// app.use('/api/v1/software', softwareRoutes);
// app.use('/api/v1/voiceovers', voiceoverRoutes);
// app.use(errorHandler);

// const server = http.createServer(app);
// const io = socketIo(server);

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // socket.on('tileFavorited', (data) => {
//   //   socket.broadcast.emit('tileFavorited', data);
//   // });

//   // socket.on('tileUnfavorited', (data) => {
//   //   socket.broadcast.emit('tileUnfavorited', data);
//   // });

//   // socket.on('tileDetailsRequested', (data) => {
//   //   socket.broadcast.emit('tileDetailsRequested', data);
//   // });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// In server.js
log(`Server is running on port ${PORT}`);

module.exports = app;  // Export app for testing