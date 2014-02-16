var tag = require('../app/controllers/tag'),
    user = require('../app/controllers/user'),
    userEvent = require('../app/controllers/event'),
    activity = require('../app/controllers/activity'),
    message = require('../app/controllers/message'),
    tempaccount = require('../app/controllers/tempaccount'),
    profile = require('../app/controllers/profile'),
    job = require('../app/controllers/job'),
    address = require('../app/controllers/address');

module.exports = function(app, sio) {

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
    // Get user's info
    app.get('/user/:id', checkLoginStatus, user.show);

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

    // Get all activities
    app.get('/activities/:date', checkLoginStatus, activity.index);
    // Get user's activities
    app.get('/user/:id/activities/:date', checkLoginStatus, activity.index);
    // // Update activities (create new activity)
    // app.post('/user/:id/activities', checkLoginStatus, activity.create);

    // Get user's events
    app.get('/user/:id/events', checkLoginStatus, userEvent.index);
    // Update events (create new event)
    app.post('/user/:id/events', checkLoginStatus, userEvent.create);
    // Update events (update event)
    app.patch('/user/:id/events/:eventid', checkLoginStatus, userEvent.update);
    // Update events (remove event)
    app.delete('/user/:id/events/:eventid', checkLoginStatus, userEvent.remove);

    // Get user's messages
    app.get('/user/:id/messages', checkLoginStatus, message.messages);
    // Update messages (create new event)
    app.post('/user/:id/messages', checkLoginStatus, message.createMessage);
    // Update messages (update event)
    // app.patch('/user/:id/messages/:eventid', checkLoginStatus, user.updateEvent);
    // Update messages (remove event)
    app.delete('/user/:id/messages/:messageid', checkLoginStatus, message.removeMessage);

    // Introduce friend
    app.get('/friends', checkLoginStatus, user.introduce);

    // // Get user's friends
    // app.get('/user/:id/friends', checkLoginStatus, user.addFriend);
    // // Add friend
    // app.post('/user/:id/friends', checkLoginStatus, function(req, res, next) {

    //     sio.sockets.in(req.body.userid).emit('message', {
    //         title: "someone add you as a friend",
    //         msg: "you now be a friend of xxx"
    //     });

    //     next();
    // }, user.addFriend);
    // // Remove friend
    // app.delete('/user/:id/friends/:friendid', checkLoginStatus, user.removeFriend);

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

    // suggeset user while type ahead
    app.get('/suggestUser', checkLoginStatus, user.suggest);

    // Show tags
    app.get('/tags', checkLoginStatus, tag.index);
    // Update tags (update tag)
    app.patch('/tags/:id', checkLoginStatus, tag.update);
    // Update tags (remove tag)
    app.delete('/tags/:id', checkLoginStatus, tag.remove);

    // Get StackExcahge Tag Data
    app.post('/stack', checkLoginStatus, tag.create);
    app.post('/import', checkLoginStatus, user.import);
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