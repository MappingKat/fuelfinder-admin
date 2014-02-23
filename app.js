/**
 * settings
 */

 var webPort = 9999;

/**
 * Module dependencies.
 */

 var express = require('express'),
 io = require('socket.io');

 var app = module.exports = express.createServer(),
 io = io.listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(webPort);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

var clients = {};
var watchers = {};
var positions = [];

function collect_positions() {
  console.log("Collecting positions");
  positions = [];
  for (var property in clients) {
    console.log("We have a client here...");
    client_socket = clients[property];
    client_socket.get('position', function(err, position){
      console.log("Just collected a position");
      positions.push(position);
      send_positions();
    });
  }
  // If there are no clients, we still want to send the updated, empty positions to the watchers.
  if (Object.keys(clients).length == 0) {
    send_positions();
  }
}

function send_positions() {
  console.log("Sending positions");
  for (var property in watchers) {
    var socket = watchers[property];
    socket.emit('positions', {positions: positions})
  }
}

// socket.io
io.sockets.on('connection', function (socket) {
	console.log('Connection: ' + socket.id);

	socket.on('position', function(position_hash) {
    console.log(position_hash);
    socket.set('position', position_hash['position']);
    clients[socket.id] = socket;
    collect_positions();
  });

  socket.on('watching', function() {
    console.log("New watcher");
    watchers[socket.id] = socket;
    collect_positions();
  });

  socket.on('disconnect', function () {
    console.log('Disconnect:' + socket.id);
    socket.get('position', function(err, position){
      //TODO: Make sure this doesn't die for the admin since they don't have a location.
      if (err === null ) {
        console.log("Removing the client's position");
        delete clients[socket.id];
        collect_positions();
      } else {
        if (watchers[socket.id] != undefined) {
          delete watchers[socket.id];
        }
      }
    });
  });

});
