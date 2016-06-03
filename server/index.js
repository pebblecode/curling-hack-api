import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
const urlParser = bodyParser.urlencoded({ extended: false })

app.listen(process.env.PORT || 8080, () => console.log('Starting server on 8080'));

app.post('/session', cors(), urlParser, (req, res) => {
  console.log(req.body);
  console.log('pinged me');
  res.end('ok');
});
