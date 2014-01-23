define([], function() {

    var Introductions = Backbone.Collection.extend({

        idAttribute: "_id",

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url: '/friend'
    });

    return Introductions;
});