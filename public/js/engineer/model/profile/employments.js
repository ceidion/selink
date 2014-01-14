define(['model/profile/employment'], function(EmploymentModel) {

    var Employments = Backbone.Collection.extend({

        idAttribute: "_id",

        model: EmploymentModel,

        url:  function() {
            return this.document.url() + '/employments';
        }
    });

    return Employments;
});