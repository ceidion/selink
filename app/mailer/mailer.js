var path = require('path'),
    config = require('../../config/config'),
    templatesDir = path.resolve(__dirname, 'templates'),
    emailTemplates = require('email-templates'),
    nodemailer = require('nodemailer');

// Setup mail transport facility
var transport = nodemailer.createTransport("SMTP", config['production'].mail);

exports.sendPromotion = function(subscribers, promotion) {

    emailTemplates(templatesDir, function(err, template) {

        if (err) console.log(err);

        else {

            subscribers.forEach(function(subscriber) {

                template('promotion', {

                    promotion: promotion,
                    subscriber: subscriber

                }, function(err, html, text) {

                    if (err) console.log(err);

                    else {

                        transport.sendMail({
                            from: 'Joe <joe@cvbakery.com>',
                            to: subscriber.email,
                            subject: promotion.product.title,
                            html: html
                        }, function(err, responseStatus) {

                            promotion.update({$addToSet: {mailSent: subscriber.id}}, function(err, promotion) {
                                if (err) console.log(err);
                            });

                            if (err) console.log(err);
                            else {
                                console.log(responseStatus);
                            }
                        });
                    }
                });
            });
        }
    });
};