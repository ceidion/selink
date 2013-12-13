var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Product = mongoose.model('Product'),
    Promotion = mongoose.model('Promotion'),
    Subscriber = mongoose.model('Subscriber'),
    path = require('path'),
    mailer = require('../mailer/mailer');

/* Promotion List */
exports.index = function(req, res, next) {

    Promotion.find(function(err, promotions) {

        if (err) next(err);
        else {

            Product.populate(promotions, {
                path: 'product'
            }, function() {
                res.render('./admin/promotion/index', {promotions: promotions});
            });
        }
    });
};

exports.show = function(req, res, next) {};

/* New Promotion Form */
exports.new = function(req, res, next) {

    Product.find(function(err, products) {

        if (err) next(err);
        else {
            res.render('./admin/promotion/new', {products: products});
        }
    });
};

/* Create New Promotion */
exports.create = function(req, res, next) {

    console.log(req.body);

    var promotion = new Promotion(req.body);

    // For now we send mail to all subscribers
    Subscriber.count(function(err, count) {
        if (err) next(err);
        else {
            promotion.audienceCount = count;
            promotion.save(function(err, promotion){
                if (err) next(err);
                else res.redirect('/promotions/index');
            });
        }
    });
};

/* Promotion Audience Counting */
exports.countAudience = function(req, res, next) {

    // For now we send mail to all subscribers
    Subscriber.count(function(err, count) {
        if (err) next(err);
        else res.json({
            audience: count
        });
    });
};

/* !! Promote! For God! For Country! Fire! */
exports.promote = function(req, res, next) {

    // Get the promotion
    Promotion.findOne({_id: req.body.id}, function(err, promotion) {

        if (err) next(err);
        else {

            // Populate this promotion with product
            Product.populate(promotion, {
                path: 'product'
            }, function() {

                // TODO: send to all just for now
                // Get all subscribers
                Subscriber.find(function(err, subscribers) {

                    // Send promotion mail to all subscriber
                    if (err) next(err);
                    else {
                        mailer.sendPromotion(subscribers, promotion);
                        res.json({
                            message: 'Good Luck!'
                        });
                    }
                });
            });
        }
    });
};

/* Promotion Mail Test */
exports.test = function(req, res, next) {

    // Get the promotion
    Promotion.findOne({_id: req.body.id}, function(err, promotion) {

        if (err) next(err);
        else {

            // Populate this promotion with product
            Product.populate(promotion, {
                path: 'product'
            }, function() {

                // Get all administrative users
                User.find(function(err, users) {

                    // Send promotion mail to administrators for test
                    if (err) next(err);
                    else {
                        mailer.sendPromotion(users, promotion);
                        res.json({
                            message: 'test mail sent'
                        });
                    }
                });
            });
        }
    });
};

/* Count Mail Open Rate */
exports.opened = function(req, res, next) {

    Promotion.findByIdAndUpdate(req.query.pro, {$addToSet: {mailOpen: req.query.sub}}, function(err, promotion) {});
    res.sendfile(path.resolve(__dirname, '../../resource/images/', req.params.name));
};