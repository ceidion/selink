define(['common/model/event'], function(EventModel) {

    var Events = Backbone.Collection.extend({

        idAttribute: "_id",

        model: EventModel,

        url:  function() {
            return this.document.url() + '/events';
        }
    });

    return Events;
});