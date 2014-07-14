/**
 * Module dependencies.
 */
var env = process.env.NODE_ENV || 'development',
    fs = require('fs'),
    config = require('./config/config')[env],
    mongoose = require('mongoose'),
    connect = require('connect'),
    express = require('express'),
    http = require('http'),
    io = require('socket.io'),
    solrClient = require('solr-client');

// Connect to database
mongoose.connect(config.db);
mongoose.connection.on('open', function() {
    mongoose.set('debug', true);
    console.log("DataBase " + config.db + " connected.");
});

// Create Solr client
GLOBAL.solr = solrClient.createClient(config.solr);
solr.ping(function(err, obj) {
    if (err) console.log(err);
    else {
        // solr.autoCommit = true;
        console.log("Solr " + config.solr.host + ':' + config.solr.port + '/' + config.solr.core + " connected");
    }
});

// Bootstrap models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file);
});

// hold cookieParser and sessionStore for SessionSocket
var cookieParser = express.cookieParser('your secret sauce'),
    sessionStore = new connect.middleware.session.MemoryStore();

// Set up app server
var app = express();
// config server
require('./config/express')(app, config, cookieParser, sessionStore);

// Express 3 requires a http.Server to attach socke.io
var server = http.createServer(app);
// attach socket.io
GLOBAL.sio = io.listen(server);
sio.set('log level', 2);

// SessionSocket
var SessionSockets = require('session.socket.io'),
    sessionSockets = new SessionSockets(sio, sessionStore, cookieParser);

sessionSockets.on('connection', function(err, socket, session) {

    if (session) {

        socket.join(session.userId);

        socket.emit('message', {
            title: "welcome",
            msg: "welcome to selink"
        });

    } else {
        socket.emit('no-session');
    }
});

// config route
require('./config/routes')(app);

// // socket.io configuration
// sio.sockets.on('connection', function(socket) {

//     socket.emit('message', {
//         title: "welcome",
//         msg: "welcome to selink"
//     });
// });

// start server
server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

// app.listen(app.get('port'), function(){
//     console.log('Express server listening on port ' + app.get('port'));
// });
