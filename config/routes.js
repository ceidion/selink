var tag = require('../app/controllers/tag'),
    user = require('../app/controllers/user'),
    friend = require('../app/controllers/friend'),
    post = require('../app/controllers/post'),
    // userEvent = require('../app/controllers/event'),
    activity = require('../app/controllers/activity'),
    notification = require('../app/controllers/notification'),
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
        res.render('./' + req.user.type + '/index', req.user);
    });

    // User sign-up
    app.post('/signup', tempaccount.create);
    // Account activate
    app.get('/activate/:id', tempaccount.activate);

    // Get user's activities
    app.get('/users/:user/activities', checkLoginStatus, activity.index);

    // Get user's notification
    app.get('/users/:user/notifications', checkLoginStatus, notification.index);
    // update notification
    app.patch('/users/:user/notifications/:notification', checkLoginStatus, notification.update);

    // Get user's posts
    app.get('/users/:user/posts', checkLoginStatus, post.index);
    // Create new post
    app.post('/users/:user/posts', checkLoginStatus, post.create);

    // Like a post
    app.patch('/posts/:post/like', checkLoginStatus, post.liked);

    // Introduce friend
    app.get('/friends', checkLoginStatus, friend.introduce);
    // Get user's friends
    app.get('/users/:user/friends', checkLoginStatus, friend.index);
    // Request new friend
    app.patch('/users/:user/friends', checkLoginStatus, friend.create);
    // Remove friend
    app.delete('/users/:user/friends/:friend', checkLoginStatus, friend.remove);

    // Get user info
    app.get('/users/:user', checkLoginStatus, user.show);
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

    // // Get user's events
    // app.get('/users/:id/events', checkLoginStatus, userEvent.index);
    // // Create new event
    // app.post('/users/:id/events', checkLoginStatus, userEvent.create);
    // // Update events
    // app.patch('/users/:id/events/:eventid', checkLoginStatus, userEvent.update);
    // // Remove event
    // app.delete('/users/:id/events/:eventid', checkLoginStatus, userEvent.remove);

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
    app.get('/suggestUser', checkLoginStatus, friend.suggest);

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
    if (!req.session.userId) {
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