var mongoose = require('mongoose'),
    Product = mongoose.model('Product');

exports.index = function(req, res, next) {

    var query = Product.find().sort({createDate: -1});

    query.exec(function(err, products) {
        if (err) next(err);
        else res.render('./admin/product/index', {products: products});
    });
};

exports.show = function(req, res, next) {
    var id = req.params.id;

    Product.findOne({_id: id}, function(err, product) {

        if (err) next(err);
        else if (!product) next();
        else if (!req.xhr) res.render('product', {product: product});
        else res.json(product);
    });
};

exports.new = function(req, res, next) {
    res.render('./admin/product/new');
};

exports.create = function(req, res, next) {

    var product = new Product(req.body);
    product.save(function(err, product) {
        res.redirect('/products/index');
    });
};

exports.edit = function(req, res, next) {

    var id = req.params.id;

    Product.findOne({_id: id}, function(err, product) {

        if (err) next(err);
        else res.render('./admin/product/edit', {product: product});
    });
};

exports.update = function(req, res, next) {

    console.log(req.body);

    Product.findOneAndUpdate({_id: req.body.id}, req.body, function(err, product){

        if (err) next(err);
        else {
            res.redirect('/products/index');
        }
    });
};