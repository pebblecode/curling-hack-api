import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
const jsonParser = bodyParser.json()

app.listen(process.env.PORT || 8090, () => console.log('Starting server on 8090'));
const formatMessage = (msg) => `data: ${msg}\n\n`;

app.post('/session', cors(), jsonParser, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  console.log(req.body);
  // res.write(formatMessage(JSON.stringify(req.body)));
  res.end('ok');
});
