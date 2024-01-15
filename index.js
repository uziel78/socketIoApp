const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render(__dirname + '/index.ejs', { rooms: rooms });
});

// rooms array
let rooms = ['room1', 'room2'];

app.get('/room1', (req, res) => {
  res.render(__dirname + '/room.ejs', { room: 'room1' });
});

app.get('/room2', (req, res) => {
  res.render(__dirname + '/room.ejs', { room: 'room2' });
});

//room named anything example case, example room 44
// app.get('/:room', (req, res) => {
//   res.render(__dirname + '/room.ejs', { room: req.room });
// });

//newroom POST handler:
app.post('/newroom', jsonParser, (req, res) => {
  const room = req.body.room;
  //const color = req.body.color;
  app.get('/' + room, (req, res) => {
    res.render(__dirname + '/room.ejs', { room: room });
  });
  rooms.push(room);
  res.send({
    room: room,
  });
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

// listen on the connection event for incoming sockets, and log it to the console.
server.listen(3000, () => {
  console.log('listening on *:3000');
  console.log('http://localhost:3000');
});
