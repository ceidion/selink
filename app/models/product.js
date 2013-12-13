var markdown = require('markdown').markdown,
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Product = new Schema({

    niche: {
        type: String,
        trim: true
    },

    name: {
        type: String,
        trim: true,
        unique: true
    },

    title: {
        type: String,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    hasVideo: {
        type: Boolean,
        default: false
    },

    refLink: {
        type: String,
        trim: true
    },

    swipe: {
        type: String,
        trim: true
    },

    // Create Date
    createDate: {
        type: Date,
        default: Date.now
    }
});

Product.virtual('descriptionHtml').get(function() {
    if (this.description)
        return markdown.toHTML(this.description);
});

Product.virtual('swipeHtml').get(function() {
    if (this.swipe)
        return markdown.toHTML(this.swipe);
});

mongoose.model('Product', Product);