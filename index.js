// Expose this with `ngrok $PORT`
require('dotenv').config()
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const compress = require('compression')();
const expressValidator = require('express-validator');
const cors = require('cors');

const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const { WebClient } = require('@slack/client');
const slackClient = new WebClient(process.env.SLACK_TOKEN);

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

/*
This integration uses Twilio to text TO_PHONE number when an alert is triggered
*/
app.post('/twilio', (req, res, next) => {
  twilioClient.messages
  .create({
     body: `heycoral.com 🐙 trust score alert ${req.body.name} on address ${req.body.address}; 🎉`,
     from: process.env.TWILIO_FROM_PHONE_NUMBER,
     to: process.env.TWILIO_TO_PHONE_NUMBER
   })
  .then(message => console.log(message.sid))
  .done();

  console.log(req.body);
  return res.status(200).send('🎉');
});

/*
This integration uses Slack to message channel SLACK_CONVERSATION_ID when an alert is triggered
*/
app.post('/slack', (req, res, next) => {
  slackClient.chat.postMessage({ channel: process.env.SLACK_CONVERSATION_ID, text: `heycoral.com 🐙 trust score alert ${req.body.name} on address ${req.body.address}; 🎉` })
  .then((res) => {
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);

  console.log(req.body);
  return res.status(200).send('🎉');
});

app.set('port', port);

var server = app.listen(app.get('port'), function() {
  console.log('Webhook Test express server listening on port ', port);
});
