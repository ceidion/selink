var Mailer = require('../mailer/mailer.js'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    // Resume = mongoose.model('Resume'),
    TempAccount = mongoose.model('TempAccount');

exports.index = function(req, res, next) {};

exports.new = function(req, res, next) {};

exports.show = function(req, res, next) {};

exports.create = function(req, res, next) {

    // validate request parameter
    console.log(req.body);

    // create temporary account for a new registered user
    var tempAccountObj = new TempAccount(req.body, false);

    var email = req.body.email;

    // try to find a account by the user applicated account ID
    User.findOne({
        email: email
    }, function(err, user) {

        // handle error
        if (err) {
            next(err);
        }
        // if a existed account are found, require another ID
        else if (user) {
            res.status(424).json({
                msg: "このメールアドレスは既に使われてますので、他のメールアドレスを使ってください。"
            });
        }
        // for valid account ID
        else {
            // save temp account object
            tempAccountObj.save(function(err) {
                // handle error
                if (err) {
                    if (err.code == 11000)
                        res.status(424).json({
                            msg: "このメールアドレスは既に使われてますので、他のメールアドレスを使ってください。"
                        });
                    else next(err);
                } else {
                    // // send account-activate mail
                    // Mailer.sendAccountActiveMail({
                    //     id: tempAccountObj._id,
                    //     email: email
                    // });

                    // Account.find({type: "Administrator"}, function(err, admins) {
                    //     if (err) next(err);
                    //     Mailer.sendNewUserRegistedNotification(admins, {email: email});
                    // });

                    console.log("http://localhost:8080/activate/" + tempAccountObj._id);

                    // send success message
                    res.json({
                        msg: "ご利用いただきありがとうございます！ご提供したメールアドレスにメールを送りました、ご確認してください。"
                    });
                }
            });
        }
    });
};

exports.edit = function(req, res, next) {};

exports.update = function(req, res, next) {};

exports.destroy = function(req, res, next) {};

/*
    Activate temporary account
*/
exports.activate = function(req, res, next) {

    // find account by id in TempAccount collection
    TempAccount.findOne({
        _id: req.params.id
    }, function(err, tempAccount) {

        // handle error
        if (err) {
            next(err);
        }
        // if the target account not exists
        else if (!tempAccount) {
            res.status(424).send("Sorry, we can'f find register information of this account.");
        }
        // if the target account was found
        else {

            // make a temporary share ID
            var shareId = tempAccount.firstName.toLowerCase() + '.' + tempAccount.lastName.toLowerCase();

            // count the number of resume using this share ID
            Resume.count({
                shareId: new RegExp('^' + shareId, 'i')
            }, function(err, count){

                if(err) next(err);

                // if exists, alter the share ID
                if (count !== 0)
                    shareId += '.' + count;

                // create resume object for this account
                var resumeObj = new Resume({
                    firstName: tempAccount.firstName,
                    lastName: tempAccount.lastName,
                    shareId: shareId
                });

                // create real account object and connect it to resume
                var accountObj = new Account({
                    email: tempAccount.email,
                    password: tempAccount.password,
                    provider: 'local',
                    type: tempAccount.type,
                    resume: resumeObj._id
                }, false);

                // save the new account
                accountObj.save(function(err, account) {

                    // handle error
                    if (err) {
                        if (err.code == 11000) res.status(424).send("This e-mail address already in used, Please use another one.");
                        else next(err);
                    } else {

                        // save the resume object
                        resumeObj.save();

                        // remove the temporary account
                        tempAccount.remove();

                        Account.find({type: "Administrator"}, function(err, admins) {
                            if (err) next(err);
                            Mailer.sendNewUserActivatedNotification(admins, account);
                        });

                        // redirect to home page
                        res.redirect('/');
                    }
                });
            });
        }
    });

};
