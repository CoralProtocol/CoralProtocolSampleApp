## Trust Score Alerting Sample Webhook Server

Coral's Trust Score Alerts allow someone to subscribe to changes in an Ethereum or Bitcoin address' trust score.

Trust Score Alerts operate as webhooks, where the documentation can be found at [docs.heycoral.com](https://docs.heycoral.com/#a4c802a5-dbd3-4f6b-b351-ae81a4e3c659).

This repository serves as a sample app that you can clone and use, that receives Trust Score Alerts. From there you can write your own (or contribute! 😊) integrations. Twilio and Slack integrations are provided as examples.


### Setup
`npm install ngrok -g`

`npm install`

Copy `env.dist` to `.env` and fill it with your own secrets

### Development
We use [ngrok](https://ngrok.com/) to expose this application to the internet, so Coral's API can reach it.
Start the app with `npm start` and expose it in a separate temrinal with `ngrok $PORT`


### Production
This app is also accompanied by a Docker file so you can run it wherever you run your production code 😎


### Creating Alerts.
Please review our [documentation](https://docs.heycoral.com/#a4c802a5-dbd3-4f6b-b351-ae81a4e3c659) for more information on how to create an alert.


### Contribution
If you write a cool integration, please contribute it back to this sample app so that others may also stay compliant! One I personally would like to see is PagerDuty.
