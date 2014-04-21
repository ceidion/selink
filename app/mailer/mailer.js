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

exports.friendInvitation = function(recipient) {

    emailTemplates(templatesDir, function(err, template) {

        if (err) {
            console.log(err);
        } else {

            // send account active email
            template('friend-invitation', recipient, function(err, html, text) {
                if (err) {
                    console.log(err);
                } else {
                    transport.sendMail({
                        from: 'SELink <noreply@selink.jp>',
                        to: recipient.email,
                        subject: 'SELinkお友達要請',
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

exports.friendApprove = function(recipient) {

    emailTemplates(templatesDir, function(err, template) {

        if (err) {
            console.log(err);
        } else {

            // send account active email
            template('friend-approve', recipient, function(err, html, text) {
                if (err) {
                    console.log(err);
                } else {
                    transport.sendMail({
                        from: 'SELink <noreply@selink.jp>',
                        to: recipient.email,
                        subject: 'お友達要請が承認されました',
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

exports.newPost = function(recipients, post) {

    emailTemplates(templatesDir, function(err, template) {

        if (err) {
            console.log(err);
        } else {

            var Render = function(recipient, post) {

                this.locals = {
                    recipient: recipient,
                    post: post
                };

                this.send = function(err, html, text) {
                    if (err) {
                        console.log(err);
                    } else {
                            transport.sendMail({
                            from: 'SELink <noreply@selink.jp>',
                            to: recipient.email,
                            subject: post.authorName + 'さんは新しい記事を投稿しました',
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
                };

                this.batch = function(batch) {
                    batch(this.locals, templatesDir, this.send);
                };
            };

            // Load the template and send the emails
            template('new-post', true, function(err, batch) {
                for(recipient in recipients) {
                    var render = new Render(recipients[recipient], post);
                    render.batch(batch);
                }
            });
        }
    });
};

exports.newAnnouncement = function(recipients, announcement) {

    emailTemplates(templatesDir, function(err, template) {

        if (err) {
            console.log(err);
        } else {

            var Render = function(recipient, announcement) {

                this.locals = {
                    recipient: recipient,
                    announcement: announcement
                };

                this.send = function(err, html, text) {
                    if (err) {
                        console.log(err);
                    } else {
                            transport.sendMail({
                            from: 'SELink <noreply@selink.jp>',
                            to: recipient.email,
                            subject: 'SELinkからのお知らせです',
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
                };

                this.batch = function(batch) {
                    batch(this.locals, templatesDir, this.send);
                };
            };

            // Load the template and send the emails
            template('new-announcement', true, function(err, batch) {
                for(recipient in recipients) {
                    var render = new Render(recipients[recipient], announcement);
                    render.batch(batch);
                }
            });
        }
    });
};