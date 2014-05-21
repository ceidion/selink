var tag = require('../app/controllers/tag'),
    job = require('../app/controllers/job'),
    user = require('../app/controllers/user'),
    post = require('../app/controllers/post'),
    issue = require('../app/controllers/issue'),
    friend = require('../app/controllers/friend'),
    comment = require('../app/controllers/comment'),
    address = require('../app/controllers/address'),
    message = require('../app/controllers/message'),
    resetPs = require('../app/controllers/resetpassword'),
    activity = require('../app/controllers/activity'),
    userEvent = require('../app/controllers/event'),
    tempaccount = require('../app/controllers/tempaccount'),
    notification = require('../app/controllers/notification'),
    announcement = require('../app/controllers/announcement'),
    solrController = require('../app/controllers/solr');

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

    // Get news
    app.get('/newsfeed', checkLoginStatus, user.newsfeed);

    // Get notification
    app.get('/notifications', checkLoginStatus, notification.index);
    // Update notification
    app.patch('/notifications/:notification', checkLoginStatus, notification.update);

    // Get posts
    app.get('/posts', checkLoginStatus, post.index);
    // Get new posts (for home)
    app.get('/posts/news', checkLoginStatus, post.news);
    // Get specific posts
    app.get('/posts/:post', checkLoginStatus, post.show);
    // Create post
    app.post('/posts', checkLoginStatus, post.create);
    // Update post
    app.patch('/posts/:post', checkLoginStatus, post.update);
    // Like a post
    app.patch('/posts/:post/like', checkLoginStatus, post.like);
    // Bookmark a post
    app.patch('/posts/:post/bookmark', checkLoginStatus, post.bookmark);
    // Remove post
    app.delete('/posts/:post', checkLoginStatus, post.remove);

    // Comment a post
    app.post('/posts/:post/comments', checkLoginStatus, comment.create);
    // Update comment
    app.patch('/posts/:post/comments/:comment', checkLoginStatus, comment.update);
    // Like comment
    app.patch('/posts/:post/comments/:comment/like', checkLoginStatus, comment.like);
    // Reply comment
    app.patch('/posts/:post/comments/:comment/reply', checkLoginStatus, comment.create);
    // Remove comment
    app.delete('/posts/:post/comments/:comment', checkLoginStatus, comment.remove);

    // Get jobs (employer only)
    app.get('/jobs', checkLoginStatus, job.index);
    // Get new jobs (for home)
    app.get('/jobs/news', checkLoginStatus, job.news);
    // Get specific job
    app.get('/jobs/:job', checkLoginStatus, job.show);
    // Match specific job
    app.get('/jobs/:job/match', checkLoginStatus, job.match);
    // Create jobs
    app.post('/jobs', checkLoginStatus, job.create);
    // Update jobs
    app.patch('/jobs/:job', checkLoginStatus, job.update);
    // bookmark a job
    app.patch('/jobs/:job/bookmark', checkLoginStatus, job.bookmark);
    // Remove jobs
    app.delete('/jobs/:job', checkLoginStatus, job.remove);

    // Introduce friend
    app.get('/people', checkLoginStatus, friend.introduce);
    // Get friends
    app.get('/friends', checkLoginStatus, friend.index);
    // Request new friend
    app.patch('/friends', checkLoginStatus, friend.create);
    // Remove friend
    app.delete('/friends/:friend', checkLoginStatus, friend.remove);

    // Get messages
    app.get('/messages', checkLoginStatus, message.index);
    // Create new message
    app.post('/messages', checkLoginStatus, message.create);
    // Update messages
    app.patch('/messages/:message', checkLoginStatus, message.update);
    // Remove message
    app.delete('/messages/:message', checkLoginStatus, message.remove);

    // Get events
    app.get('/events', checkLoginStatus, userEvent.index);
    // Create new event
    app.post('/events', checkLoginStatus, userEvent.create);
    // Update events
    app.patch('/events/:event', checkLoginStatus, userEvent.update);
    // Remove event
    app.delete('/events/:event', checkLoginStatus, userEvent.remove);

    // Upload user photo
    app.put('/users/:user/photo', checkLoginStatus, user.uploadPhoto);
    app.put('/users/:user/photo-scale', checkLoginStatus, user.scalePhoto);
    // Upload cover
    app.put('/users/:user/cover', checkLoginStatus, user.uploadCover);
    app.put('/users/:user/cover-scale', checkLoginStatus, user.scaleCover);

    // Get user info
    app.get('/users/:user', checkLoginStatus, user.show);
    // Update user info (first-level property)
    app.patch('/users/:id', checkLoginStatus, user.update);
    // Create nested collection item
    app.post('/users/:id/:sub', checkLoginStatus, user.createSubDocument);
    // Update nested collection item
    app.patch('/users/:id/:sub/:subid', checkLoginStatus, user.updateSubDocument);
    // Remove nested collection item
    app.delete('/users/:id/:sub/:subid', checkLoginStatus, user.removeSubDocument);

    // Get activities
    app.get('/activities', checkLoginStatus, activity.index);

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

    // Show announcements
    app.get('/announcements', checkLoginStatus, announcement.index);
    // Create new announcement
    app.post('/announcements', checkLoginStatus, announcement.create);
    // Update announcement (update announcement)
    app.patch('/announcements/:announcement', checkLoginStatus, announcement.update);
    // Update announcement (remove announcement)
    app.delete('/announcements/:announcement', checkLoginStatus, announcement.remove);

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

    // Solr index
    app.get('/solr/user', checkLoginStatus, solrController.user);
    app.get('/solr/job', checkLoginStatus, solrController.job);
    app.get('/solr/post', checkLoginStatus, solrController.post);
    app.get('/solr/message', checkLoginStatus, solrController.message);
    app.get('/solr/announcement', checkLoginStatus, solrController.announcement);
    app.get('/solr/tag', checkLoginStatus, solrController.tag);
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