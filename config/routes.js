var user = require('../app/controllers/user');
var tempaccount = require('../app/controllers/tempaccount');
var profile = require('../app/controllers/profile.js');

module.exports = function(app) {

    // Landing
    app.get('/', function(req, res, next){
        res.render('landing');
    });

    // User Login
    app.post('/login', user.login);
    // User Logout
    app.get('/logout', user.logout);

    // Home
    app.get('/home', checkLoginStatus, function(req, res, next){

        if(req.session.user.type === "admin") {
            console.log("admin");
            res.render('./admin/index');
        } else {
            console.log("engineer");
            res.render('./engineer/index', req.session.user);
        }
    });

    // User sign-up
    app.post('/signup', tempaccount.create);
    // Account activate
    app.get('/activate/:id', tempaccount.activate);

    // Get single profile
    app.get('/profile/:id', checkLoginStatus, profile.show);
    // Update profile
    app.patch('/profile/:id', checkLoginStatus, profile.update);
    // Upload photo
    app.put('/profile/:id', checkLoginStatus, profile.update);

};

checkLoginStatus = function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        next();
    }
};