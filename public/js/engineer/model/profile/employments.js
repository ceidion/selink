define([], function() {

    var Employments = Backbone.Collection.extend({

        idAttribute: "_id",

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url:  function() {
            return this.document.url() + '/employments';
        }
    });

    return Employments;
});