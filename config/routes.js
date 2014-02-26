var tag = require('../app/controllers/tag'),
    user = require('../app/controllers/user'),
    post = require('../app/controllers/post'),
    // userEvent = require('../app/controllers/event'),
    activity = require('../app/controllers/activity'),
    // message = require('../app/controllers/message'),
    tempaccount = require('../app/controllers/tempaccount'),
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
        res.render('./' + req.session.user.type + '/index', req.session.user);
    });

    // User sign-up
    app.post('/signup', tempaccount.create);
    // Account activate
    app.get('/activate/:id', tempaccount.activate);

    // Get user's posts
    app.get('/users/:user/posts', checkLoginStatus, post.index);
    // Create new post
    app.post('/users/:user/posts', checkLoginStatus, post.create);

    // Get user's friends
    app.get('/users/:id/friends', checkLoginStatus, user.showFriend);
    // Request new friend
    app.post('/users/:id/friends', checkLoginStatus, user.addFriend);

    // update friend request
    app.put('/users/:id/notifications/:notificationId', checkLoginStatus, user.approveFriend);

    // Get user info
    app.get('/users/:id', checkLoginStatus, user.show);
    // Upload user photo
    app.put('/users/:id', checkLoginStatus, user.update);
    // Update user info (first-level property)
    app.patch('/users/:id', checkLoginStatus, user.update);
    // Create nested collection item
    app.post('/users/:id/:sub', checkLoginStatus, user.createSubDocument);
    // Update nested collection item
    app.patch('/users/:id/:sub/:subid', checkLoginStatus, user.updateSubDocument);
    // Remove nested collection item
    app.delete('/users/:id/:sub/:subid', checkLoginStatus, user.removeSubDocument);

    // Get all activities
    app.get('/activities', checkLoginStatus, activity.index);
    // Get user's activities
    app.get('/users/:id/activities', checkLoginStatus, activity.index);

    // // Get user's events
    // app.get('/users/:id/events', checkLoginStatus, userEvent.index);
    // // Create new event
    // app.post('/users/:id/events', checkLoginStatus, userEvent.create);
    // // Update events
    // app.patch('/users/:id/events/:eventid', checkLoginStatus, userEvent.update);
    // // Remove event
    // app.delete('/users/:id/events/:eventid', checkLoginStatus, userEvent.remove);

    // // Get user's messages
    // app.get('/users/:id/messages', checkLoginStatus, message.messages);
    // // Update messages (create new event)
    // app.post('/users/:id/messages', checkLoginStatus, message.createMessage);
    // Update messages (update event)
    // app.patch('/users/:id/messages/:eventid', checkLoginStatus, user.updateEvent);
    // // Update messages (remove event)
    // app.delete('/users/:id/messages/:messageid', checkLoginStatus, message.removeMessage);

    // Introduce friend
    app.get('/friends', checkLoginStatus, user.introduce);

    // // Get user's friends
    // app.get('/users/:id/friends', checkLoginStatus, user.addFriend);
    // // Add friend
    // app.post('/users/:id/friends', checkLoginStatus, function(req, res, next) {

    //     sio.sockets.in(req.body.userid).emit('message', {
    //         title: "someone add you as a friend",
    //         msg: "you now be a friend of xxx"
    //     });

    //     next();
    // }, user.addFriend);
    // // Remove friend
    // app.delete('/users/:id/friends/:friendid', checkLoginStatus, user.removeFriend);

    // Get user's jobs (employer only)
    app.get('/users/:id/jobs', checkLoginStatus, job.index);
    // Update jobs (create new job)
    app.post('/users/:id/jobs', checkLoginStatus, job.create);
    // Update jobs (update job)
    app.patch('/users/:id/jobs/:jobid', checkLoginStatus, job.update);
    // Update jobs (remove job)
    app.delete('/users/:id/jobs/:jobid', checkLoginStatus, job.remove);

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
    // import dataf from SELink1.0
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