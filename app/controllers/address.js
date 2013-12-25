var mongoose = require('mongoose'),
    Address = mongoose.model('Address');

exports.show = function(req, res) {

    Address.findOne({
        zipCode: req.params.zipcode
    }, function(err, address) {
        if (err) res.send("error happend: " + err);
        console.log(address);
        if (address) res.json(address);
    });
};