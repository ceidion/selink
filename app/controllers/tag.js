var mongoose = require('mongoose'),
    Tag = mongoose.model('Tag');

exports.index = function(req, res, next) {

    var query = Tag.find().sort({count:-1}).limit(1000);

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