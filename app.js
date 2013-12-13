/**
 * Module dependencies.
 */
var env = process.env.NODE_ENV || 'development',
    fs = require('fs'),
    config = require('./config/config')[env],
    mongoose = require('mongoose'),
    express = require('express');

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
// start server
app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
