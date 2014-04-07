var tag = require('../app/controllers/tag'),
    job = require('../app/controllers/job'),
    user = require('../app/controllers/user'),
    post = require('../app/controllers/post'),
    issue = require('../app/controllers/issue'),
    friend = require('../app/controllers/friend'),
    address = require('../app/controllers/address'),
    resetPs = require('../app/controllers/resetpassword'),
    activity = require('../app/controllers/activity'),
    userEvent = require('../app/controllers/event'),
    tempaccount = require('../app/controllers/tempaccount'),
    notification = require('../app/controllers/notification');

module.exports = function(app, sio) {

    // Landing
    app.get('/', function(req, res, next){
        res.render('landing');
    });

    // User sign-up
    app.post('/signup', tempaccount.create);
    // Account activate
    app.get('/activate/:id', tempaccount.activate);

    // Retrieve password request
    app.post('/retrieve', resetPs.create);
    // Retrieve password page
    app.get('/retrieve/:id', resetPs.show);
    // Reset password
    app.put('/retrieve/:id', resetPs.update);

    // User Login
    app.post('/login', user.login);
    // User Logout
    app.get('/logout', user.logout);

    // SPA bootstrap
    app.get('/spa', checkLoginStatus, function(req, res, next){
        res.render('./' + req.user.type + '/index', req.user);
    });

    // Get activities
    app.get('/activities', checkLoginStatus, activity.index);

    // Get notification
    app.get('/notifications', checkLoginStatus, notification.index);
    // Update notification
    app.patch('/notifications/:notification', checkLoginStatus, notification.update);

    // Get posts
    app.get('/posts', checkLoginStatus, post.index);
    // Get specific posts
    app.get('/posts/:post', checkLoginStatus, post.show);
    // Create post
    app.post('/posts', checkLoginStatus, post.create);
    // Update post
    app.patch('/posts/:post', checkLoginStatus, post.update);
    // like a post
    app.patch('/posts/:post/like', checkLoginStatus, post.like);
    // bookmark a post
    app.patch('/posts/:post/bookmark', checkLoginStatus, post.bookmark);
    // Remove post
    app.delete('/posts/:post', checkLoginStatus, post.remove);
    // comment a post
    app.post('/posts/:post/comments', checkLoginStatus, post.comment);

    // Get new posts (for home)
    // app.get('/posts', checkLoginStatus, post.home);

    // Get jobs (employer only)
    app.get('/jobs', checkLoginStatus, job.index);
    // Get specific posts
    app.get('/jobs/:job', checkLoginStatus, job.show);
    // Create jobs
    app.post('/jobs', checkLoginStatus, job.create);
    // Update jobs
    app.patch('/jobs/:job', checkLoginStatus, job.update);
    // Like a job
    app.patch('/jobs/:job/like', checkLoginStatus, job.update);
    // bookmark a job
    app.patch('/jobs/:job/bookmark', checkLoginStatus, job.update);
    // Remove jobs
    app.delete('/jobs/:job', checkLoginStatus, job.remove);
    // Comment a job
    app.post('/jobs/:job/comments', checkLoginStatus, job.create);

    // Get new jobs (for home)
    // app.get('/jobs', checkLoginStatus, job.home);

    // Introduce friend
    app.get('/people', checkLoginStatus, friend.introduce);
    // Get friends
    app.get('/friends', checkLoginStatus, friend.index);
    // Request new friend
    app.patch('/friends', checkLoginStatus, friend.create);
    // Remove friend
    app.delete('/friends/:friend', checkLoginStatus, friend.remove);

    // Get events
    app.get('/events', checkLoginStatus, userEvent.index);
    // Create new event
    app.post('/events', checkLoginStatus, userEvent.create);
    // Update events
    app.patch('/events/:event', checkLoginStatus, userEvent.update);
    // Remove event
    app.delete('/events/:event', checkLoginStatus, userEvent.remove);

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

    // Show tags
    app.get('/tags', checkLoginStatus, tag.index);
    // Update tags (update tag)
    app.patch('/tags/:id', checkLoginStatus, tag.update);
    // Update tags (remove tag)
    app.delete('/tags/:id', checkLoginStatus, tag.remove);

    // Show issues
    app.get('/issues', checkLoginStatus, issue.index);
    // Create new issue
    app.post('/issues', checkLoginStatus, issue.create);
    // Update issue (update issue)
    app.patch('/issues/:issue', checkLoginStatus, issue.update);
    // Update issue (remove issue)
    app.delete('/issues/:issue', checkLoginStatus, issue.remove);

    // query address
    app.get('/address/:zipcode', checkLoginStatus, address.show);
    // suggeset user while type ahead
    app.get('/suggest/user', checkLoginStatus, friend.suggest);
    // suggeset tag while type ahead
    app.get('/suggest/tag', checkLoginStatus, tag.suggest);

    // Get StackExcahge Tag Data
    app.post('/stack', checkLoginStatus, tag.create);
    // import data from SELink1.0
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