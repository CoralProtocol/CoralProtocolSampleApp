// Expose this with `ngrok $PORT`
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
const request = require("request");

const twilioClient = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const { WebClient } = require("@slack/client");

const slackClient = new WebClient(process.env.SLACK_TOKEN);

const port = process.env.PORT;

const corsOptions = {
  origin: "*"
};

const app = express();
app.use(bodyParser());
app.use(expressValidator());
app.use(express.json());
app.options("*", cors());
app.use(cors(corsOptions));

/*
This call is the bread and butter of using Coral. It allows your to programmatically pull address trust scores
https://docs.heycoral.com/#c502d430-c0bc-46a3-8122-a976fab8c4c5
*/
app.get("/trust-scores/:blockchain/:address", (req, res) => {
  const options = {
    url: `https://api.heycoral.com/trust?address=${
      req.params.address
    }&blockchain=${req.params.blockchain}`,
    method: "GET",
    headers: {
      "x-api-key": process.env.YOUR_API_KEY
    }
  };

  request(options, (err, resp, body) => {
    if (err) {
      return console.log(err);
    }
    return res.status(200).send(body);
  });
});

/*
This call allows your to set up an alert on addresses you are interested in watching.
https://docs.heycoral.com/#a4c802a5-dbd3-4f6b-b351-ae81a4e3c659
*/
app.post("/trust-score-alerts", (req, res) => {
  const options = {
    url: "https://api.heycoral.com/trust-score-alerts",
    method: "POST",
    headers: {
      "x-api-key": process.env.YOUR_API_KEY
    },
    json: {
      blockchain: req.body.blockchain,
      name: req.body.name,
      address: req.body.address,
      url: req.body.url,
      secret: req.body.secret,
      action: "fraud_instance.new"
    }
  };

  request(options, (err, resp, body) => {
    if (err) {
      return console.log(err);
    }
    return res.status(200).send(body);
  });
});

/*
These routes are all third party platform integrations, to alert when a trust
score alert is triggered
*/
app.post("/", (req, res) => {
  console.log(req.body);
  return res
    .status(200)
    .send(
      `heycoral.com 🐙 trust score alert ${req.body.name} on address ${
        req.body.address
      }; 🎉`
    );
});

/*
This integration uses Twilio to text TO_PHONE number when an alert is triggered
*/
app.post("/twilio", (req, res) => {
  twilioClient.messages
    .create({
      body: `Coral Protocol 🚨 Name: ${req.body.name}, Address ${
        req.body.address
      }; 🎉`,
      from: process.env.TWILIO_FROM_PHONE_NUMBER,
      to: process.env.TWILIO_TO_PHONE_NUMBER
    })
    .then(message => console.log(message.sid))
    .catch()
    .done();

  console.log(req.body);
  return res.status(200).send("🎉");
});

/*
This integration uses Slack to message channel SLACK_CONVERSATION_ID when an alert is triggered
*/
app.post("/slack", (req, res) => {
  slackClient.chat
    .postMessage({
      channel: process.env.SLACK_CONVERSATION_ID,
      text: `
      🚨 Coral Protocol Trust Score Alert 🚨 \n
      🐙 *Alert Name:* \`${req.body.name}\` \n
      🐙 *Action Type:* \`${req.body.action}\` \n
      🐙 *Address:* \`${req.body.address}\` \n
      🐙 *Blockchain:* \`${req.body.blockchain}\` \n
      Thanks for keeping the blockchain safe 🎉
    `
    })
    .then(slackRes => {
      console.log("Message sent: ", slackRes.ts);
    })
    .catch(console.error);

  console.log(req.body);
  return res.status(200).send("🎉");
});

app.set("port", port);

app.listen(app.get("port"), function() {
  console.log("Coral Protocol example app running on port ", port);
});
