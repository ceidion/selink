define([], function() {

    var events = Backbone.Collection.extend({

        idAttribute: "_id",

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url:  function() {
            return '/user/' + this.userId + '/events';
        }
    });

    return events;
});