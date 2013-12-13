var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var Subscriber = new Schema({
    // Prouduct
    product: {
        type: Schema.Types.ObjectId
    },
    // Email
    email: {
        type: String,
        trim: true
    },
    // Create Date
    createDate: {
        type: Date,
        default: Date.now
    },
});

Subscriber.virtual('optinDate').get(function() {
    if (this.createDate)
        return moment(new Date(this.createDate)).format('YYYY/MM/DD HH:mm:ss');
});

mongoose.model('Subscriber', Subscriber);