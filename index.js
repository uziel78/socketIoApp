const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/room1', (req, res) => {
  res.render(__dirname + '/room.ejs', { room: 'room1' });
});

app.get('/room2', (req, res) => {
  res.render(__dirname + '/room.ejs', { room: 'room2' });
});

const admin = io.of('/admin');

admin.on('connection', (socket) => {
  socket.on('join', (data) => {
    socket.join(data.room);
    admin
      .in(data.room)
      .emit('chat message', `New user joined ${data.room} room!`);
  });

  socket.on('chat message', (data) => {
    admin.in(data.room).emit('chat message', data.msg);
  });

  socket.on('disconnect', () => {
    admin.emit('chat message', 'user disconnected');
  });
});

// // route handler
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// // Whenever someone connects this gets executed. setting up a connection to a socket
// const admin = io.of('/admin');

// admin.on('connection', (socket) => {
//   socket.on('chat message', (msg) => {
//     admin.emit('chat message', msg);
//   });
// });

//console.log('ID: ' + socket.id);
//console.log('a user connected');
//});

// listen on the connection event for incoming sockets, and log it to the console.
server.listen(3000, () => {
  console.log('listening on *:3000');
  console.log('http://localhost:3000');
});
