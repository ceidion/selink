var users = require('../app/controllers/users'),
    products = require('../app/controllers/products'),
    promotions = require('../app/controllers/promotions'),
    subscribers = require('../app/controllers/subscribers');

module.exports = function(app) {

    // Landing
    app.get('/', function(req, res, next){
        res.render('landing');
    });
    // User Login
    app.post('/login', users.login);
    // User Logout
    app.get('/logout', users.logout);

    // // Home
    // app.get('/home', checkLoginStatus, function(req, res, next){

    //     if(req.session.user.type === "admin") {
    //         console.log("admin");
    //         res.render('./admin/index');
    //     } else {
    //         console.log("engineer");
    //         res.render('./engineer/index');
    //     }
    // });

    // // Products List
    // app.get('/products/index', checkLoginStatus, products.index);
    // // Create New Product Form
    // app.get('/products/new', checkLoginStatus, products.new);
    // // Create New Product Action
    // app.post('/products/new', checkLoginStatus, products.create);
    // // Edit Product Form
    // app.get('/products/:id/edit', checkLoginStatus, products.edit);
    // // Edit Product Action
    // app.post('/products/edit', checkLoginStatus, products.update);
    // // Single Squeeze Page
    // app.get('/products/:id', products.show);

    // // Subscribers List
    // app.get('/subscribers/index', checkLoginStatus, subscribers.index);
    // // User Optin
    // app.post('/subscribers/:id', subscribers.create);

    // // Promotion List
    // app.get('/promotions/index', checkLoginStatus, promotions.index);
    // // Create New Promotion Form
    // app.get('/promotions/new', checkLoginStatus, promotions.new);
    // // Create New Promotion Action
    // app.post('/promotions/new', checkLoginStatus, promotions.create);
    // // Proximate Audience Number
    // app.get('/promotions/audience-count', checkLoginStatus, promotions.countAudience);
    // // Send Promotion Test Mail
    // app.post('/promotions/test', checkLoginStatus, promotions.test);
    // // !! Promote !!
    // app.post('/promotions/promote', checkLoginStatus, promotions.promote);
    // Mail Open Process
    app.get('/resource/images/:name', promotions.opened);
};

checkLoginStatus = function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        next();
    }
};