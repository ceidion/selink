var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.login = function(req, res, next) {

    // look up user info
    User.findOne(req.body, function(err, user) {

        // pass if error happend
        if (err) next(err);
        // if the account not found, return the fail message
        else if (!user) {
            res.status(401).send("Authentication failed, Please check your input and try again.");
        }
        // if account could be found
        else {
            // put account into session
            req.session.user = user;

            // return index page
            if (user.type === 'admin') {
                res.render('./admin/index');
            } else {
                res.render('./engineer/index');
            }
        }
    });
};

exports.logout = function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
};