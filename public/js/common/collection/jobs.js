define(['common/model/job'], function(JobModel) {

    return Backbone.Collection.extend({

        model: JobModel,

        url: function() {
            return this.document.url() + '/jobs';
        }
    });
});