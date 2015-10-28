var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var http = require("http");
var express = require('express');
var bodyParser = require('body-parser');

var port = 3000;
var ip = "127.0.0.1";

var storage = [];

var app = express();
var server = http.createServer(app);

app.use('/', express.static(__dirname + '/../client'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/../client/index.html')
})

app.use(function(req, res, next) {
  res.header(headers);
  if (req.method === 'OPTIONS') {
    res.header('Content-Type', 'text/plain');
    res.status(200).send();
  } else {
    next();
  }
});

app.get('/classes/messages', function(req, res) {
  res.header('Content-type', 'application/json');
  res.status(200).send('{"results" :' + JSON.stringify(storage) + '}');
});

app.use(bodyParser.json());

app.post('/classes/messages', function(req, res) {
  storage.push(req.body);
  res.status(201).send("OK")
});

app.use(function(req, res) {
  res.status(404).send("No file found")
})

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
