var express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function(app, config, cookieParser, sessionStore) {

    // Port number, default is 8081
    app.set('port', process.env.PORT || 8081);

    // View directory
    app.set('views', path.join(config.root, '/app/views'));

    // View engine is jade
    app.set('view engine', 'jade');

    // Fav-icon
    app.use(express.favicon());

    // Logger
    app.use(express.logger('dev'));

    // Use json instead of body parser, cause file upload not needed, yet
    app.use(express.json());
    app.use(express.urlencoded());

    // Override request method
    app.use(express.methodOverride());

    // Parse cookie before session
    app.use(cookieParser);

    // Parse request body
    app.use(express.bodyParser({
        // keep upload file extension
        keepExtensions: true,
        // file upload folder
        uploadDir: path.join(__dirname, '../public/upload')
    }));

    // Memory storage session
    app.use(express.session({ store: sessionStore }));

    /* TODO: CSRF support? */

    // Set up LESS
    app.use(require('less-middleware')({
        src: path.join(config.root, 'public', 'css', 'less'),
        paths: path.join(config.root, 'public', 'css', 'less', 'bootstrap'),
        dest: path.join(config.root, 'public', 'css'),
        prefix: '/css',
        compress: true
    }));

    // Public folder
    app.use(express.static(path.join(config.root, 'public')));

    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    // Load user info on request
    app.param('user', function(req, res, next, id){

        User.findById(id, function(err, user){
            if (err) {
                next(err);
            } else if (user) {
                req.user = user;
                next();
            } else {
                next(new Error('failed to load user'));
            }
        });
    });

    // Routes
    app.use(app.router);

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next){

        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
            || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }

        // log it
        // send emails if you want
        console.error(err.stack);
    });

    // assume 404 since no middleware responded
    app.use(function(req, res, next){
        // 404 page
        res.status(404).render('404', {
            product: ""
        });
    });
};