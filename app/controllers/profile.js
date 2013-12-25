// Definition of Profile
var mongoose = require('mongoose');
var Profile = mongoose.model('Profile');

// Index
exports.index = function(req, res, next) {};

// Get single Profile
exports.show = function(req, res, next) {

    Profile.findOne({
        _id: req.params.id
    }, function(err, profile) {
        if (err) next(err);
        console.log(profile);
        if (profile) res.json(profile);
    });
};

// Create Profile
exports.create = function(req, res, next) {};

// Edit Profile
exports.update = function(req, res, next) {

    delete req.body._id;
    console.log(req.body);
    console.log(req.files);

    if (req.files && req.files.photo) {
        var photoType = req.files.photo.type;
        var photoPath = req.files.photo.path;

        if (['image/jpeg', 'image/gif', 'image/png'].indexOf(photoType) === -1) {
            res.status(415).send("Only jpeg, gif or png file are valide");
            return;
        }

        var photoName = /.*[\/|\\](.*)$/.exec(photoPath)[1];
        req.body.photo = 'http://localhost:8081/upload/' + photoName;
    }

    Profile.findById(req.params.id, function(err, profile) {
        if (err) next(err);
        else {
            for(var prop in req.body) {
                profile[prop] = req.body[prop];
            }
            profile.save(function(err, newProfile) {
                if (err) next(err);
                else res.send(newProfile);
            });
        }
    });
};

// Delete Profile
exports.destroy = function(req, res, next) {};

exports.myresume = function(req, res, next) {

    console.log("share id : " + req.params[0]);

    Profile.findOne({
        shareId: req.params[0]
    }, function(err, resume) {
        if (err) next(err);
        if (resume) {
            res.render('resume/' + resume.template, resume);
        } else {
            next(new Error('not found'));
        }
    });
};
