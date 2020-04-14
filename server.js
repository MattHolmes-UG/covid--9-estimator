const express = require('express');
const bodyParser = require('body-parser');
const js2xml = require('js2xml');
const session = require('express-session');
const path = require('path');
const log = require('./backend/logger');

const estimator = require('./backend/estimate');

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS, PATCH');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, X-XSRF-TOKEN, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// All OPTIONS requests return a simple status: 'OK'
app.options('*', (req, res) => {
  res.json({
    status: 'OK'
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SECRETKEY, // Remember to add these
  resave: false,
  saveUninitialized: false
}));

app.get('/api/v1/on-covid-19/', (req, res) => {
  log('GET', { path: '/api/v1/on-covid-19/', status: 200, timetaken: 40 });
  res.sendFile(path.join(`${__dirname}backend/views/`));
});
app.post('/api/v1/on-covid-19/', (req, res) => {
  let { data } = req.body;
  if (!data) {
    data = {
      region: {
        name: 'Africa',
        avgAge: 19.7,
        avgDailyIncomeInUSD: 5,
        avgDailyIncomePopulation: 0.71
      },
      periodType: 'days',
      timeToElapse: 58,
      reportedCases: 674,
      population: 66622705,
      totalHospitalBeds: 1380614
    };
  }
  const output = estimator(data);
  req.session.output = output;
  console.log(output);
  res.json(output);
});
app.get('/api/v1/on-covid-19/xml', (req, res) => {
  const outputXml = js2xml('output', req.session.output);
  const xmlVersion = outputXml.toString();
  res.setHeader('Content-Type', 'application/xml');
  res.send(xmlVersion);
});
app.get('/api/v1/on-covid-19/json', (req, res) => {
  const { output } = req.session;
  res.setHeader('Content-Type', 'application/json');
  res.json(output);
});
app.get('/api/v1/on-covid-19/logs', (req, res) => {
  const logFilePath = `${__dirname}/backend/logs.txt`;
  res.setHeader('Content-Type', 'application/plain-text');
  res.sendFile(logFilePath);
});

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
