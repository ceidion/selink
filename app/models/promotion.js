var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Promotion = new Schema({

    product: {
        type: Schema.Types.ObjectId
    },

    audience: {
        type: String,
        trim: true
    },

    audienceCount: {
        type: Number,
        default: 0
    },

    mailSent: [Schema.Types.ObjectId],

    mailOpen: [Schema.Types.ObjectId],

    // Create Date
    createDate: {
        type: Date,
        default: Date.now
    }
});

Promotion.virtual('createDateStr').get(function() {
    if (this.createDate)
        return moment(new Date(this.createDate)).format('YYYY/MM/DD HH:mm:ss');
});

mongoose.model('Promotion', Promotion);