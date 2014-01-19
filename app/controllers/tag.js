var mongoose = require('mongoose'),
    Tag = mongoose.model('Tag');

exports.index = function(req, res, next) {

    var query = Tag.find().sort({count:-1}).limit(100);

    query.exec(function(err, tags) {
        if(err) next(err);

        res.json(tags);
    });
};

exports.create = function(req, res) {

    if (req.body.tag) {

        req.body.tag.forEach(function(tagData) {
            var newTag = new Tag(tagData, false);
            newTag.save(function(err) {
                if (err) console.log(err);
            });
        });
    }

    res.send('got it');
};

exports.update = function(req, res, next) {

    // look up tag info
    Tag.findById(req.params.id, function(err, tag) {
        if (err) next(err);
        else {

            for(var prop in req.body) {
                tag[prop] = req.body[prop];
            }

            tag.save(function(err, newTag) {
                if (err) next(err);
                else res.send(newTag);
            });
        }
    });
};

exports.remove = function(req, res, next) {

    // look up tag info
    Tag.findById(req.params.id, function(err, tag) {
        if (err) next(err);
        else {

            tag.remove(function(err, removedTag) {
                if (err) next(err);
                else res.send(removedTag);
            });
        }
    });
};