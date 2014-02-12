/**
 * Module dependencies.
 */
var env = process.env.NODE_ENV || 'development',
    fs = require('fs'),
    config = require('./config/config')[env],
    mongoose = require('mongoose'),
    express = require('express'),
    http = require('http'),
    socket = require('socket.io');

// Connect to database
mongoose.connect(config.db);
mongoose.connection.on('open', function() {
    mongoose.set('debug', true);
    console.log("DataBase " + config.db + " connected.");
});

// Bootstrap models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file);
});

// Set up app server
var app = express();
// config server
require('./config/express')(app, config);
// config route
require('./config/routes')(app);

// Express 3 requires a http.Server to attach socke.io
var server = http.createServer(app);
// attach socket.io
var io = socket.listen(server);

var online = [];
// socket.io configuration
io.sockets.on('connection', function(socket) {

    online.push(socket);
    console.log('online user is: ' + online.length);

    socket.emit('message', {
        title: "welcome",
        msg: "welcome to selink"
    });
});

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

// // start server
// app.listen(app.get('port'), function(){
//     console.log('Express server listening on port ' + app.get('port'));
// });
