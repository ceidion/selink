define(['common/model/job'], function(JobModel) {

    var Jobs = Backbone.Collection.extend({

        idAttribute: "_id",

        model: JobModel,

        url: function() {
        	return this.document.url() + '/jobs';
        }
    });

    return Jobs;
});