define([
    'text!common/template/job/main.html',
    'common/view/composite-isotope',
    'common/view/job/item',
    'common/view/job/edit',
    'common/collection/base',
    'common/model/job'
], function(
    template,
    BaseView,
    ItemView,
    EditView,
    BaseCollection,
    JobModel
) {

    // Job collection
    var JobCollection = BaseCollection.extend({

        model: JobModel,

        url: '/jobs'
    });

    return BaseView.extend({

        // Template
        template: template,

        // item view
        itemView: ItemView,

        // event
        events: {
            'click .btn-create': 'showCreateModal'
        },

        // Initializer
        initialize: function() {

            this.itemEvents = _.extend({}, this.itemEvents, {
                'edit': 'showEditorModal'
            });

            this.collectionEvents = _.extend({}, this.collectionEvents, {
                'change': 'updateJob',
                'add': 'updateJob'
            });

            // create job collection
            this.collection = new JobCollection();

            // call super initializer
            BaseView.prototype.initialize.apply(this);

            // var self = this;

            // // populate job collection
            // this.collection.fetch({
            //     success: function() {
            //         // change the behavior of add sub view
            //         self.appendHtml = function(collectionView, itemView, index) {
            //             // prepend new post and reIsotope
            //             self.$el.find('.job-container').prepend(itemView.$el).isotope('reloadItems');
            //         };
            //         self.listenTo(self.collection, 'change', self.updateJob);
            //         self.listenTo(self.collection, 'add', self.updateJob);
            //     }
            // });
        },

        // display create job modal
        showCreateModal: function() {

            var jobEditView = new EditView({
                collection: this.collection,
            });

            selink.modalArea.show(jobEditView);
            selink.modalArea.$el.modal('show');
        },

        // display edit job modal
        showEditorModal: function(event, view) {

            var jobEditView = new EditView({
                model: view.model
            });

            selink.modalArea.show(jobEditView);
            selink.modalArea.$el.modal('show');
        },

        // save/update job
        updateJob: function(job) {

            var self = this;

            // if this is a new job
            if (job.isNew()) {

                // safe the job
                this.collection.create(job, {
                    // job saved successful
                    success: function(model, response, options) {
                        selink.modalArea.$el.modal('hide');
                    },
                    silent: true,
                    wait: true,
                    at: 0
                });

            } else {

                // update the job
                job.save(null, {
                    // job saved successful
                    success: function(model, response, options) {
                        selink.modalArea.$el.modal('hide');
                    },
                    silent: true,
                    patch: true,
                    wait: true
                });
            }
        }

    });
});