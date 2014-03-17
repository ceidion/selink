define(['common/model/post'], function(PostModel) {

    return Backbone.Collection.extend({

        model: PostModel,

        url: function() {
            return this.document.url() + '/posts';
        }
    });
});