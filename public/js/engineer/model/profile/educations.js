define([], function() {

    var Educations = Backbone.Collection.extend({

        idAttribute: "_id",

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url:  function() {
            return this.document.url() + '/educations';
        }
    });

    return Educations;
});