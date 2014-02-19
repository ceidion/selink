define([], function() {

    var Notifications = Backbone.Collection.extend({

        idAttribute: "_id",

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url:  function() {
            return this.document.url() + '/notifications';
        }
    });

    return Notifications;
});