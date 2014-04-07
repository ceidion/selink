var path = require('path'),
    config = require('../../config/config'),
    templatesDir = path.resolve(__dirname, 'templates'),
    emailTemplates = require('email-templates'),
    nodemailer = require('nodemailer');

// Setup mail transport facility
var transport = nodemailer.createTransport("SMTP", config['development'].mail);

exports.accountActive = function(recipient) {

    emailTemplates(templatesDir, function(err, template) {

        if (err) {
            console.log(err);
        } else {

            // send account active email
            template('account-active', recipient, function(err, html, text) {
                if (err) {
                    console.log(err);
                } else {
                    transport.sendMail({
                        from: 'SELink <noreply@selink.jp>',
                        to: recipient.email,
                        subject: 'SELinkへようこそ！',
                        html: html,
                        text: text
                    }, function(err, responseStatus) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(responseStatus.message);
                        }
                    });
                }
            });
        }
    });
};

exports.resetPassword = function(recipient) {

    emailTemplates(templatesDir, function(err, template) {

        if (err) {
            console.log(err);
        } else {

            // send account active email
            template('password-retrieve', recipient, function(err, html, text) {
                if (err) {
                    console.log(err);
                } else {
                    transport.sendMail({
                        from: 'SELink <noreply@selink.jp>',
                        to: recipient.email,
                        subject: 'SELinkパースワード更新案内',
                        html: html,
                        text: text
                    }, function(err, responseStatus) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(responseStatus.message);
                        }
                    });
                }
            });
        }
    });
};