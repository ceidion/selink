var request = require('request'),
    mongoose = require('mongoose'),
    Notification = mongoose.model('Notification');

// Notification index
exports.index = function(req, res, next) {

    // find the notifications of specific user
    Notification.find({_owner: req.user.id})
        .sort('-createDate')
        .limit(20)
        .populate('_from', 'firstName lastName photo')
        .exec(function(err, notifications) {
            if (err) next(err);
            else res.json(notifications);
        });
};