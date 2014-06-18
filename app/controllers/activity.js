var mongoose = require('mongoose'),
    Activity = mongoose.model('Activity');

/*
    No. | Activity Type   | Target  | Content
    ------------------------------------------
    1.  | user-activate   | none    | none
    2.  | user-login      | none    | none
    3.  | user-logout     | none    | none
    4.  | friend-invited  | user    | none
    5.  | friend-approved | user    | none
    6.  | friend-declined | user    | none
    7.  | friend-break    | user    | none
    8.  | post-new        | post    | post summary
    9.  | post-liked      | post    | post summary
    10. | post-bookmarked | post    | post summary
    11. | post-commented  | post    | comment summary
    12. | comment-liked   | post    | comment summary
    13. | job-new         | job     | job name
    14. | job-bookmarked  | job     | job name
    15. | message-new     | message | message subject
    16. | group-new       | group   | group
    17. | group-invited   | group   | group
    18. | group-joined    | group   | group
    19. | group-refused   | group   | group
*/

// Activity index
exports.index = function(req, res, next) {

    // page number
    var page = req.query.page || 0;

    // find the activities of all users
    Activity.find()
        .where('_owner').ne(req.user.id).in(req.user.friends)
        .where('type').nin(['user-login', 'user-logout', 'friend-declined', 'message-new'])
        .sort('-createDate')
        .skip(20*page)  // skip n page
        .limit(20)  // 20 user per page
        .populate('_owner', 'type firstName lastName title cover photo createDate')
        .exec(function(err, activities) {
            if (err) next(err);
            else res.json(activities);
        });
};