define([], function() {

    var Profile = Backbone.DeepModel.extend({

        idAttribute: "_id",

        urlRoot: '/profile',
    });

    return Profile;

});