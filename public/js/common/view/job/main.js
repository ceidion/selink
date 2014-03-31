define([
    'text!common/template/job/main.html',
    'common/view/job/item',
    'common/view/job/edit',
    'common/collection/base',
    'common/model/job'
], function(
    template,
    ItemView,
    EditView,
    BaseCollection,
    JobModel
) {

    // Job collection
    var JobCollection = BaseCollection.extend({

        model: JobModel,

        url: function() {
            return this.document.url() + '/jobs';
        }
    });

    return Backbone.Marionette.CompositeView.extend({

        // Template
        template: template,

        // item view container
        itemViewContainer: '.job-container',

        // item view
        itemView: ItemView,

        // event
        events: {
            'click .btn-create': 'showCreateModal'
        },

        // collection events
        collectionEvents: {
            'sync': 'onSync',
        },

        // item view events
        itemEvents: {
            'edit': 'showEditorModal',
            'remove': 'onRemove',
            'shiftColumn': 'shiftColumn'
        },

        // Initializer
        initialize: function() {

            var self = this;

            // create job collection
            this.collection = new JobCollection(null, {document: this.model});

            // populate job collection
            this.collection.fetch({
                success: function() {
                    // change the behavior of add sub view
                    self.appendHtml = function(collectionView, itemView, index) {
                        // prepend new post and reIsotope
                        self.$el.find('.job-container').prepend(itemView.$el).isotope('reloadItems');
                    };
                    self.listenTo(self.collection, 'change', self.updateJob);
                    self.listenTo(self.collection, 'add', self.updateJob);
                }
            });
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
                    wait: true
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
        },

        // remove job
        onRemove: function(event, view) {

            // remove job from isotope
            $('.job-container').isotope('remove', view.$el, function() {
                // remove job model
                view.model.destroy({
                    success: function(model, response) {
                    },
                    wait: true
                });
            });
        },

        // isotope after collection get synced
        onSync: function() {

            var self = this;

            this.$el.find('.job-container').imagesLoaded(function() {
                self.$el.find('.job-container').isotope({
                    layoutMode: 'selinkMasonry',
                    itemSelector : '.job-item',
                    resizable: false
                });
            });
        },

        // shift column
        shiftColumn: function(event, view) {
            $('.job-container').isotope('selinkShiftColumn', view.el);
        }
    });
});