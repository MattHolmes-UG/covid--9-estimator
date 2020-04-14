const express = require('express');
const bodyParser = require('body-parser');
const Js2xml = require('js2xml').Js2Xml;
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
  secret: 'testsecretforapp', // Remember to add these
  resave: false,
  saveUninitialized: false
}));
app.use((req, res, next) => {
  req.session.startTime = new Date().getTime();
  next();
});


app.get('/', (req, res) => {
  log(req, res);
  return res.sendFile(path.join(__dirname, 'backend/views/dataform.html'));
});
app.get('/api/v1/on-covid-19', (req, res) => {
  console.log(req.url, req.method, res.statusCode);
  log(req, res);
  return res.json(req.session.output);
});
app.post('/api/v1/on-covid-19', (req, res) => {
  const data = req.body;
  if (!data) {
    return res.send('Please provide data to compute');
  }
  const output = estimator(data);
  req.session.output = output;
  log(req, res);
  return res.json(output);
});
app.get('/api/v1/on-covid-19/xml', (req, res) => {
  const { output } = req.session;
  if (output) {
    const outputXml = new Js2xml('output', output);
    const xmlVersion = outputXml.toString();
    res.setHeader('Content-Type', 'application/xml');
    log(req, res);
    return res.send(xmlVersion);
  }
  return res.send('Please input data to compute');
});
app.post('/api/v1/on-covid-19/xml', (req, res) => {
  const data = req.body;
  if (!data) {
    return res.send('Please provide data to compute');
  }
  const output = estimator(data);
  req.session.output = output;
  const outputXml = new Js2xml('output', req.session.output);
  const xmlVersion = outputXml.toString();
  res.setHeader('Content-Type', 'application/xml');
  log(req, res);
  return res.send(xmlVersion);
});
app.get('/api/v1/on-covid-19/json', (req, res) => {
  const { output } = req.session;
  res.setHeader('Content-Type', 'application/json');
  log(req, res);
  return res.json(output);
});
app.post('/api/v1/on-covid-19/json', (req, res) => {
  const data = req.body;
  if (!data) {
    return res.send('Please provide data to compute');
  }
  const output = estimator(data);
  req.session.output = output;
  res.setHeader('Content-Type', 'application/json');
  log(req, res);
  return res.json(output);
});
app.get('/api/v1/on-covid-19/logs', (req, res) => {
  const logFilePath = `${__dirname}/backend/logs.txt`;
  res.setHeader('Content-Type', 'text/plain');
  log(req, res);
  return res.sendFile(logFilePath);
});

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
