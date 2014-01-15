var mongoose = require('mongoose'),
    Tag = mongoose.model('Tag');

exports.create = function(req, res) {

    req.body.tag.forEach(function(tagData) {
        var newTag = new Tag(tagData, false);
        newTag.save(function(err) {
            if (err) console.log(err);
        });        
    })

    res.send('got it');
};

exports.stack = function(req, res, next) {

    console.log("request body: " + util.inspect(req.body));
    console.log("request params: " + util.inspect(req.params));
    res.send('got it');
};
