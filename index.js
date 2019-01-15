// Expose this with `ngrok $PORT`
require('dotenv').config()
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const compress = require('compression')();
const expressValidator = require('express-validator');
const cors = require('cors');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const port = process.env.PORT;

const corsOptions = {
  origin: '*'
};

const app = express();
app.use(bodyParser());
app.use(expressValidator());
app.use(express.json());
app.options('*', cors())
app.use(cors(corsOptions));

app.post('/', (req, res, next) => {
  console.log(req.body);
  return res.status(200).send(`heycoral.com 🐙 trust score alert ${req.body.name} on address ${req.body.address}; 🎉`);
});

app.post('/text-me', (req, res, next) => {
  client.messages
  .create({
     body: `heycoral.com 🐙 trust score alert ${req.body.name} on address ${req.body.address}; 🎉`,
     from: '+14159428108',
     to: process.env.TWILIO_PHONE_NUMBER
   })
  .then(message => console.log(message.sid))
  .done();

  console.log(req.body);
  return res.status(200).send('🎉');
});

app.set('port', port);

var server = app.listen(app.get('port'), function() {
  console.log('Webhook Test express server listening on port ', port);
});
