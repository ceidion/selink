define(['common/model/education'], function(EducationModel) {

    var Educations = Backbone.Collection.extend({

        idAttribute: "_id",

        model: EducationModel,

        url:  function() {
            return this.document.url() + '/educations';
        }
    });

    return Educations;
});