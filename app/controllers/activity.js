var request = require('request'),
    mongoose = require('mongoose'),
    Activity = mongoose.model('Activity');

/*
    Activity Type:
    1. user-login
    2. user-logout
    3. user-friend-invited
    4. user-friend-approved
    5. user-friend-declined
    6. user-friend-break
    7. user-post
    8. user-post-liked
    9. user-post-bookmarked
    10. user-post-commented
    11. user-job
*/

// Activity index
exports.index = function(req, res, next) {

    // request({
    //     url: 'http://localhost:8080/selink/mobile/api/employee.htm?pageAction=getEmployeeList',
    //     json: true
    // }, function(err, response, body) {
    //     console.log(body);
    // });

    // page number
    var page = req.query.page || 0;

    // find the activities of all users
    Activity.find()
        .where('_owner').ne(req.user.id).in(req.user.friends)
        .where('type').nin(['user-login', 'user-logout', 'user-friend-declined'])
        .sort('-createDate')
        .skip(20*page)  // skip n page
        .limit(20)  // 20 user per page
        .populate('_owner', '_id firstName lastName photo')
        .exec(function(err, activities) {
            if (err) next(err);
            else res.json(activities);
        });
};