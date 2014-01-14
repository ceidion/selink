define(['model/event'], function(EventModel) {

    var Events = Backbone.Collection.extend({

        idAttribute: "_id",

        // model: Backbone.Model.extend({idAttribute: "_id"}),
        model: EventModel,

        url:  function() {
            return '/user/' + this.userId + '/events';
        }
    });

    return Events;
});