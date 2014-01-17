define(['common/model/job'], function(JobModel) {

    var Jobs = Backbone.Collection.extend({

        idAttribute: "_id",

        model: JobModel,

        urlRoot:  '/job'
    });

    return Jobs;
});