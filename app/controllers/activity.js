var request = require('request'),
    mongoose = require('mongoose'),
    Activity = mongoose.model('Activity');

/*
    No. | Activity Type        | Target | Content
    ------------------------------------------
    1.  | user-activate        | none   | none
    2.  | user-login           | none   | none
    3.  | user-logout          | none   | none
    4.  | user-friend-invited  | user   | none
    5.  | user-friend-approved | user   | none
    6.  | user-friend-declined | user   | none
    7.  | user-friend-break    | user   | none
    8.  | user-post            | post   | post summary
    9.  | user-post-liked      | post   | post summary
    10. | user-post-bookmarked | post   | post summary
    11. | user-post-commented  | post   | comment summary
    12. | user-job             | job    | job name
    13. | user-job-bookmarked  | job    | job name
    14. | user-message         | message| message subject
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
        .where('type').nin(['user-login', 'user-logout', 'user-friend-declined', 'user-message'])
        .sort('-createDate')
        .skip(20*page)  // skip n page
        .limit(20)  // 20 user per page
        .populate('_owner', '_id firstName lastName photo')
        .exec(function(err, activities) {
            if (err) next(err);
            else res.json(activities);
        });
};