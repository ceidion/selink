define([], function() {

    return Backbone.Collection.extend({

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url: function() {
            return this.document.url() + '/friends';
        }
    });
});