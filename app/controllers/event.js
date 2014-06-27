var _ = require('underscore'),
    mongoose = require('mongoose'),
    Event = mongoose.model('Event'),
    Group = mongoose.model('Group'),
    Activity = mongoose.model('Activity');

exports.index = function(req, res, next) {

    Event.find()
        .or([{_owner: req.user.id}, {group: {$in: req.user.groups}}])
        .populate('group', 'name cover description')
        .exec(function(err, events) {

            if (err) next(err);
            else res.json(events);
        });
};

exports.create = function(req, res, next) {

    _.extend(req.body, {_owner: req.user.id});

    Event.create(req.body, function(err, newEvent) {

        if (err) next(err);
        else {

            if (newEvent.group)　{

                Group.findByIdAndUpdate(newEvent.group, {$addToSet: {events: newEvent._id}}, function(err, group) {
                    if (err) next(err);
                    else {

                        // create activity
                        Activity.create({
                            _owner: req.user.id,
                            type: 'group-event-new',
                            targetEvent: newEvent._id,
                            targetGroup: group._id
                        }, function(err, activity) {
                            if (err) next(err);
                        });

                        newEvent.populate({
                            path: 'group',
                            select: 'name cover description'
                        }, function(err, event) {

                            if (err) next(err);
                            else {

                                // TODO: send email to group participants

                                group.participants.forEach(function(room) {
                                    sio.sockets.in(room).emit('group-event-new', event);
                                });
                            }
                        });

                        res.json(newEvent);
                    }
                });
            } else {

                Activity.create({
                    _owner: req.user.id,
                    type: 'event-new',
                    targetEvent: newEvent._id
                }, function(err, activity) {
                    if (err) next(err);
                });

                res.json(newEvent);
            }
        }
    });
};

exports.update = function(req, res, next) {

    var newEvent = _.omit(req.body, '_id');

    console.info("#########################");
    console.log(req.params);
    console.log(req.body);
    console.info("#########################");

    Event.findByIdAndUpdate(req.params.event, newEvent, function(err, event) {

        console.log(err);

        if (err) next(err);
        else res.json(event);
    });
};

exports.remove = function(req, res, next) {

    Event.findByIdAndRemove(req.params.event, function(err, event) {

        if (err) next(err);
        else res.json(event);
    });
};