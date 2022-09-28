const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send({test: "test"});
})

let users = {};

io.on('connection', (socket) => {
    //User connected
    let currentUser = '';
    
    socket.on('User connected', user => {
      currentUser = user;
      users[user.username] = socket.id;
      socket.broadcast.emit('User connected', user);
    });

    socket.on('disconnect', () => {
      socket.broadcast.emit('User disconnected', currentUser);
    });

    socket.on('User registered', () => {
      socket.broadcast.emit('User registered');
    })

    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });

    socket.on("private message", msg => {
      io.to(users[msg.receiver]).emit("private message", msg);
    });

    socket.on("private typing", receiver => {
      io.to(users[receiver]).emit("private typing", receiver);
    });

    socket.on("invite", msg => {
      io.to(users[msg.username]).emit("invite", msg);
    });
});



server.listen(port, () => {
  console.log('listening on *:8000');
});