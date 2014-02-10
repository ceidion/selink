define(['common/model/message'], function(MessageModel) {

    var Messages = Backbone.Collection.extend({

        idAttribute: "_id",

        model: MessageModel,

        url: function() {
            return this.document.url() + '/messages';
        }
    });

    return Messages;
});