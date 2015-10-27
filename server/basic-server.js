/* Import node's http module: */
var http = require("http");
var messages = require("./request-handler");
var url = require('url');
var mime = require('mime');
var express = require('express');

var port = 3000;
var ip = "127.0.0.1";


var router = {
  '/classes/messages' : messages.requestHandler, 
  '/classes/room1' : messages.requestHandler
}

var server = http.createServer(function(request, response) {
  if (request.url === '/classes/room1') {
    console.log("teststub")
  }

  var path = url.parse(request.url).pathname;
  console.log(path)

  var route = router[path]
  if (route) {
    route(request, response);
  } else {
    response.writeHead(404, headers)
    response.end();
  }

});
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

// To start this server, run:
//
//   node basic-server.js
//
// on the command line.
//
// To connect to the server, load http://127.0.0.1:3000 in your web
// browser.
//
// server.listen() will continue running as long as there is the
// possibility of serving more requests. To stop your server, hit
// Ctrl-C on the command line.

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};