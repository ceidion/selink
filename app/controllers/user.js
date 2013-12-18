var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.login = function(req, res, next) {

    console.log(req.body);

    // look up user info
    User.findOne(req.body, function(err, user) {

        // pass if error happend
        if (err) next(err);
        // if the account not found, return the fail message
        else if (!user) {
            res.status(401).json({
                title: "認証失敗です",
                msg: "ユーザIDとパースワードを確かめて、もう一度ご入力ください。"
            });
        }
        // if account could be found
        else {
            // put account into session
            req.session.user = user;
            res.json({
                msg: "welcome!"
            });
        }
    });
};

exports.logout = function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
};