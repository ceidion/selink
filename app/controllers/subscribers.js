var mongoose = require('mongoose'),
    Subscriber = mongoose.model('Subscriber'),
    Product = mongoose.model('Product');

exports.index = function(req, res, next) {

    var query = Subscriber.find().sort({createDate: -1});

    query.exec(function(err, subscribers) {
        // return index page
        if (err) next(err);
        else {
            Product.populate(subscribers, {
                path: "product"
            }, function() {
                res.render('./admin/subscriber/index', {subscribers: subscribers});
            });
        }
    });
};

exports.create = function(req, res, next){

    var id = req.params.id;
    var email = req.body.email;

    Product.findOne({_id: id}, function(err, product) {

        if (err) next(err);
        else if (!product) next();
        else if (!email
            || email === ""
            || !email.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/)) {

            res.render('product', {
                product: product,
                info: "Please enter a valide email address to proceed."
            });

        } else {

            Subscriber.find({
                product: id,
                email: email
            }, function(err, record) {

                if (err) next();
                else if (record.length) {

                    // res.render('product', {
                    //     product: product,
                    //     info: "This email adress is already in used, Please try another one."
                    // });
                    res.redirect(product.refLink);

                } else {

                    var subscriber =　new Subscriber({
                        product: id,
                        email: email
                    });

                    subscriber.save(function(err, obj) {
                        if(err) next(err);
                        res.redirect(product.refLink);
                    });
                }
            });
        }
    });

};