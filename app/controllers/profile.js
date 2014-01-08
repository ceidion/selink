var util = require('util');
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

    console.log("request body: " + util.inspect(req.body));
    console.log("request params: " + util.inspect(req.params));
    console.log("request attach: " + util.inspect(req.files));
    delete req.body._id;

    // handle photo file
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

// Create new sub document
exports.createSubDocument = function(req, res, next) {

    Profile.findById(req.params.id, function(err, profile) {
        if (err) next(err);
        else {

            var length = profile[req.params.sub].push(req.body);

            profile.save(function(err, newProfile) {
                if (err) next(err);
                else res.send(newProfile[req.params.sub][length - 1]);
            });
        }
    });
};

// Edit sub document
exports.updateSubDocument = function(req, res, next) {

    Profile.findById(req.params.id, function(err, profile) {
        if (err) next(err);
        else {

            var subDoc = profile[req.params.sub].id(req.params.subid);

            if (subDoc) {

                for(var prop in req.body) {
                    subDoc[prop] = req.body[prop];
                }

                profile.save(function(err, newProfile) {
                    if (err) next(err);
                    else res.send(subDoc);
                });
            } else {
                res.status(404).json({
                    msg: "更新失敗しました"
                });
            }
        }
    });

};

exports.removeSubDocument = function(req, res, next) {

    Profile.findById(req.params.id, function(err, profile) {
        if (err) next(err);
        else {

            var subDoc = profile[req.params.sub].id(req.params.subid);

            if (subDoc) {

                var removedDoc = subDoc.remove();

                profile.save(function(err, newProfile) {
                    if (err) next(err);
                    else res.send(removedDoc);
                });
            } else {
                res.status(404).json({
                    msg: "更新失敗しました"
                });
            }
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
