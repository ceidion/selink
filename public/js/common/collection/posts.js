define(['common/model/post'], function(PostModel) {

    var Posts = Backbone.Collection.extend({

        idAttribute: "_id",

        model: PostModel,

        url: function() {
            return this.document.url() + '/posts';
        }
    });

    return Posts;
});