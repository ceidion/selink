var user = require('../app/controllers/user');
var tempaccount = require('../app/controllers/tempaccount');
var profile = require('../app/controllers/profile');
var address = require('../app/controllers/address');

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
    // Update profile (first-level property)
    app.patch('/profile/:id', checkLoginStatus, profile.update);
    // Update profile (create nested collection item)
    app.post('/profile/:id/:sub', checkLoginStatus, profile.createSubDocument);
    // Update profile (update nested collection item)
    app.patch('/profile/:id/:sub/:subid', checkLoginStatus, profile.updateSubDocument);
    // Upload photo
    app.put('/profile/:id', checkLoginStatus, profile.update);

    // query address
    app.get('/address/:zipcode', checkLoginStatus, address.show);

};

checkLoginStatus = function(req, res, next) {
    if (!req.session.user) {
        if (req.xhr) {
            res.status(401).json({
                title: "セッションの有効期限が切りました。",
                msg: "セキュリティのため、しばらく操作しない場合はサーバーからセッションを切断することがあります。お手数ですが、もう一度ログインしてください。"
            });
        } else {
            res.redirect('/');
        }
    } else {
        next();
    }
};