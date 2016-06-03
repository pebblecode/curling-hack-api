import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
const jsonParser = bodyParser.json()
let gameCount = 0;
let winners = [];
let losers = [];
let users = [];

// const DISTANCE_BETWEEN_IBEACONS = 0.5; // In metres

// function findPosition (beacons) {
//   const lines = beacons.map(b => b.accuracy);
//   const a = DISTANCE_BETWEEN_IBEACONS;
//   const b = lines[0];
//   const c = lines[1];
//   const angleC = findCosAngle(a, b, c);
//   const angleA = findCosAngle(b, c, a);
//   const angleB = findCosAngle(c, a, b);

//   // Assuming angleC is the one at 0,0 - could work this out from colour
//   // AngleA is at the tip of the triangle, where the phone is
 
//   // We know the hypotenuse, get the opposite side:
//   const xCoord = Math.cos(angleC) * b;
//   // And the adjacent
//   const yCoord = Math.sin(angleC) * b;

//   return { x: xCoord, y: yCoord };
// }

// function findCosAngle (a, b, c) {
//   return Math.cos( 
//       ( (Math.pow(a, 2) + Math.pow(b, 2)) - Math.pow(c, 2)) / 
//       ( 2 * a * b )
//     );
// }

function reset () {
  users = [];
  winners = [];
  losers = [];
}

function checkWinner () {
  const proximities = users
  users
    .filter(b => b.beacons[0].proximity === 'immediate')
    .forEach(b => b.winner = true);
  if (users.filter(b => b.stopped).length === users.length) {
    users.filter(b => b.winner).forEach(w => {
      const newWinner = w;
      newWinner.gameCount = gameCount;
      winners.push(newWinner)
    });
    gameCount++;
  }
  losers = users.filter(u => !u.winner);
  console.log(`PROXIMITIES: ${users.map(i => i.beacons[0].proximity)}`);
  console.log(`WINNERS: ${winners}`);
  console.log(`LOSERS: ${losers}`);
}

app.listen(process.env.PORT || 8090, () => console.log('Starting server on 8090'));
const formatMessage = (msg) => `data: ${msg}\n\n`;

app.post('/session', cors(), jsonParser, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  const newUser = req.body;
  const { userName, beacons } = newUser;
  newUser.stopped = true;

  // // Safety Check:
  // if (beacons.length !== 2) {
  //   console.log('Cannot see 2 beacons!!!');
  //   return res.end('SHIIIIIIT');
  // }
  // beacons.forEach(b => {
  //   if (typeof b !== 'number' || b < 0) {
  //     console.log('Cannot get 2 beacon lengths...');
  //     return res.end('SHIIIIIIT');
  //   }
  // })

  // !users[userName] ? users[userName] = {} : false; 
  // if (beacons.map(i => i.accuracy) === req.body.beacons.map(i => i.accuracy)) {
  //   users[userName].stopped = true;
  //   checkWinner();
  // }

  const idx = users.map(b => b.userName).indexOf(userName);

  users.splice(idx, 1, newUser);
  // users[userName].coords = findPosition(beacons);
  checkWinner();
  // console.log('TESTING')
  console.log(users);
  res.end('ok');
});

app.post('/play', cors(), jsonParser, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const newUser = req.body;
  newUser.stopped = false;
  users.push(req.body);
  res.end('ok');
});

app.get('/winners', cors(), jsonParser, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write(JSON.stringify(winners));
  res.end();
});

app.get('/users', cors(), jsonParser, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write(JSON.stringify(users));
  res.end();
});

app.get('/reset', cors(), jsonParser, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  reset();
  res.end('ok');
});
