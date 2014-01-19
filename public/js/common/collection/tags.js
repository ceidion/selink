define([], function() {

    var Tags = Backbone.Collection.extend({

        idAttribute: "_id",

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url:  '/tags'
    });

    return Tags;
});