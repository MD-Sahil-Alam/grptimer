const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

const users = {};

io.on('connection', (socket) => {
  socket.on('registerUser', (userName) => {
    const userId = socket.id;

    // Create initial timer state for this user
    users[userId] = {
      userName: userName || `User-${userId.slice(0,6)}`,
      startTime: null,
      elapsedTime: 0,
      isRunning: false
    };

    // Send initial user state to all connected clients
    io.emit('updateUsers', users);
  });

  socket.on('startTimer', () => {
    const user = users[socket.id];
    if (user && !user.isRunning) {
      user.startTime = Date.now() - (user.elapsedTime || 0);
      user.isRunning = true;
      io.emit('updateUsers', users);
    }
  });

  socket.on('pauseTimer', () => {
    const user = users[socket.id];
    if (user && user.isRunning) {
      user.elapsedTime = Date.now() - user.startTime;
      user.isRunning = false;
      io.emit('updateUsers', users);
    }
  });

  socket.on('resetTimer', () => {
    const user = users[socket.id];
    if (user) {
      user.startTime = null;
      user.elapsedTime = 0;
      user.isRunning = false;
      io.emit('updateUsers', users);
    }
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('updateUsers', users);
  });
});

const msg = [
       
]


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});