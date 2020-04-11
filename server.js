const express = require('express');
const bodyParser = require('body-parser');
// const js2xml = require('js2xml');
// const log = require('simple-node-logger');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/v1/on-covid-19/', (req, res) => {
  res.json('hi');
});
app.post('/api/v1/on-covid-19/', (req, res) => {
  res.json('hi');
});
app.get('/api/v1/on-covid-19/xml', (req, res) => {
  res.json('xml');
});
app.get('/api/v1/on-covid-19/json', (req, res) => {
  res.json('json');
});
app.get('/api/v1/on-covid-19/logs', (req, res) => {
  res.json('logs');
});

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
