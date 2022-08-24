const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use('/', express.static(__dirname + '/'));

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen((port = 80), () => {
  console.log(port);
});

//

let roomIdx = 0;
let room = null;

// const game = {
//   tick: 100,
//   isGameReady: false,
//   isMinionRushing: false,
//   nextMinionLane: 'middle',
//   player1: {
//     playerNum: 1,
//     minionProp: { health: 10, speed: 2, count: 3 },
//     minions: [],
//     turrets: [],
//   },
//   player2: {
//     playerNum: 2,
//     minionProp: { health: 10, speed: 2, count: 3 },
//     minions: [],
//     turrets: [],
//   },
// };

io.on('connection', (socket) => {
  socket.on('playerJoin', (d) => {
    try {
      if (room) {
        if (room.player1 && room.player2) return;
        console.log(1);
        room.player2 = socket;
      } else {
        console.log(2);
        room = { roomIdx: roomIdx++, player1: socket };
      }

      if (room.player1 && room.player2) {
        console.log(3);
        room.player1.emit('gameReady', 1);
        room.player2.emit('gameReady', 2);
      }
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('turretDeployed', (data) => {
    try {
      console.log(data);
      room.player1.emit('turretDeployed', data);
      room.player2.emit('turretDeployed', data);
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('disconnect', () => {
    try {
      if (room?.player1 === socket || room?.player2 === socket) {
        room = null;
      }
    } catch (e) {
      console.error(e);
    }
  });
});
