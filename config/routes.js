var tag = require('../app/controllers/tag'),
    user = require('../app/controllers/user'),
    message = require('../app/controllers/message'),
    tempaccount = require('../app/controllers/tempaccount'),
    profile = require('../app/controllers/profile'),
    job = require('../app/controllers/job'),
    address = require('../app/controllers/address');

module.exports = function(app) {

    // Landing
    app.get('/', function(req, res, next){
        res.render('landing');
    });

    // User Login
    app.post('/login', user.login);
    // User Logout
    app.get('/logout', user.logout);

    // SPA bootstrap
    app.get('/spa', checkLoginStatus, function(req, res, next){

        if (req.session.user.type === "admin") {
            console.log("admin");
            res.render('./admin/index', req.session.user);
        } else if (req.session.user.type === "employer") {
            console.log("employer");
            res.render('./employer/index', req.session.user);
        } else {
            console.log("engineer");
            res.render('./engineer/index', req.session.user);
        }
    });

    // User sign-up
    app.post('/signup', tempaccount.create);
    // Account activate
    app.get('/activate/:id', tempaccount.activate);
    // Get user's events
    app.get('/user/:id', checkLoginStatus, user.show);

    // Introduce friend
    app.get('/friend', checkLoginStatus, user.introduce);

    // Get single profile
    app.get('/profile/:id', checkLoginStatus, profile.show);
    // Update profile (first-level property)
    app.patch('/profile/:id', checkLoginStatus, profile.update);
    // Update profile (create nested collection item)
    app.post('/profile/:id/:sub', checkLoginStatus, profile.createSubDocument);
    // Update profile (update nested collection item)
    app.patch('/profile/:id/:sub/:subid', checkLoginStatus, profile.updateSubDocument);
    // Update profile (remove nested collection item)
    app.delete('/profile/:id/:sub/:subid', checkLoginStatus, profile.removeSubDocument);
    // Upload photo
    app.put('/profile/:id', checkLoginStatus, profile.update);

    // Get user's events
    app.get('/user/:id/events', checkLoginStatus, user.events);
    // Update events (create new event)
    app.post('/user/:id/events', checkLoginStatus, user.createEvent);
    // Update events (update event)
    app.patch('/user/:id/events/:eventid', checkLoginStatus, user.updateEvent);
    // Update events (remove event)
    app.delete('/user/:id/events/:eventid', checkLoginStatus, user.removeEvent);

    // Get user's messages
    app.get('/user/:id/messages', checkLoginStatus, message.messages);
    // Update messages (create new event)
    app.post('/user/:id/messages', checkLoginStatus, message.createMessage);
    // Update messages (update event)
    // app.patch('/user/:id/messages/:eventid', checkLoginStatus, user.updateEvent);
    // Update messages (remove event)
    app.delete('/user/:id/messages/:messageid', checkLoginStatus, message.removeMessage);

    // Get user's jobs (employer only)
    app.get('/user/:id/jobs', checkLoginStatus, job.index);
    // Update jobs (create new job)
    app.post('/user/:id/jobs', checkLoginStatus, job.create);
    // Update jobs (update job)
    app.patch('/user/:id/jobs/:jobid', checkLoginStatus, job.update);
    // Update jobs (remove job)
    app.delete('/user/:id/jobs/:jobid', checkLoginStatus, job.remove);

    // query address
    app.get('/address/:zipcode', checkLoginStatus, address.show);

    // Get StackExcahge Tag Data
    app.post('/stack', checkLoginStatus, tag.create);
    // Show tags
    app.get('/tags', checkLoginStatus, tag.index);
    // Update tags (update tag)
    app.patch('/tags/:id', checkLoginStatus, tag.update);
    // Update tags (remove tag)
    app.delete('/tags/:id', checkLoginStatus, tag.remove);

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