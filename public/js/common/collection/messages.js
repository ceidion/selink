define(['common/model/message'], function(MessageModel) {

    return Backbone.Collection.extend({

        model: MessageModel,

        url: function() {
            return this.document.url() + '/messages';
        }
    });
});