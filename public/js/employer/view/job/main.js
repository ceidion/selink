define([
    'text!employer/template/job/main.html',
    'employer/view/job/list',
    'employer/view/job/edit',
    'common/model/job'
], function(
    template,
    JobListView,
    JobEditView,
    JobModel
) {

    var JobCollection = Backbone.Collection.extend({

        model: JobModel,

        url: function() {
            return this.document.url() + '/jobs';
        }
    });

    return Backbone.Marionette.Layout.extend({

        // Template
        template: template,

        events: {
            'click .btn-add': 'showCreateModal'
        },

        // regions
        regions: {
            jobListRegion: '.job-container',
            jobEditRegion: '.modal'
        },

        // Initializer
        initialize: function() {

            var self = this;

            this.collection = new JobCollection();
            this.collection.document = this.model;

            this.collection.fetch({
                success: function() {
                    self.listenTo(self.collection, 'change', self.updateJob);
                    self.listenTo(self.collection, 'add', self.createJob);
                }
            });

            this.jobListView = new JobListView({
                model: this.model,
                collection: this.collection,
            });
        },

        // after render
        onRender: function() {
            this.jobListRegion.show(this.jobListView);
        },

        showCreateModal: function() {

            this.jobEditView = new JobEditView({
                // model: this.model,
                collection: this.collection,
            });

            this.jobEditRegion.show(this.jobEditView);

            // show modal
            this.$el.find('.modal').modal('show');
        },

        createJob: function(job) {

            var self = this;

            // safe the job
            this.collection.create(job, {

                // job saved successful
                success: function(model, response, options) {
                    self.$el.find('.modal').modal('hide');
                },
                // if error happend
                error: function(model, xhr, options) {

                },
                patch: true,
                wait: true
            });
        }
    });
});