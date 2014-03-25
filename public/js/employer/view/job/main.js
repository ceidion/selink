define([
    'text!employer/template/job/main.html',
    'employer/view/job/item',
    'employer/view/job/edit',
    'common/model/job'
], function(
    template,
    ItemView,
    EditView,
    JobModel
) {

    var JobCollection = Backbone.Collection.extend({

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
            'sync': 'reIsotope',
        },

        // item view events
        itemEvents: {
            'edit': 'showEditorModal',
            'job:change': 'shiftColumn'
        },

        // Initializer
        initialize: function() {

            var self = this;

            this.collection = new JobCollection();
            this.collection.document = this.model;

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

        // after render
        onRender: function() {

            // create region manager (this composite view will have layout ability)
            this.rm = new Backbone.Marionette.RegionManager();
            // create regions
            this.regions = this.rm.addRegions({
                jobEditRegion: '.modal'
            });
        },

        // before close
        onBeforeClose: function() {
            // close region manager
            this.rm.close();
        },

        showCreateModal: function() {

            this.jobEditView = new EditView({
                // model: this.model,
                collection: this.collection,
            });

            this.regions.jobEditRegion.show(this.jobEditView);

            // show modal
            this.$el.find('.modal').modal('show');
        },

        updateJob: function(job) {

            var self = this;

            if (job.isNew()) {

                // safe the job
                this.collection.create(job, {
                    // job saved successful
                    success: function(model, response, options) {
                        self.$el.find('.modal').modal('hide');
                    },
                    silent: true,
                    wait: true
                });

            } else {

                job.save(null, {
                    // job saved successful
                    success: function(model, response, options) {
                        self.$el.find('.modal').modal('hide');
                    },
                    silent: true,
                    patch: true,
                    wait: true
                });
            }
        },

        showEditorModal: function(event, view) {

            this.jobEditView = new EditView({
                model: view.model
            });

            this.regions.jobEditRegion.show(this.jobEditView);

            // show modal
            this.$el.find('.modal').modal('show');
        },

        // re-isotope after collection get synced
        reIsotope: function() {

            var self = this;

            this.$el.find('.job-container').imagesLoaded(function() {
                self.$el.find('.job-container').isotope({
                    layoutMode: 'selinkMasonry',
                    itemSelector : '.job-item',
                    resizable: false
                });
            });
        },

        shiftColumn: function(event, view) {
            $('.job-container').isotope('selinkShiftColumn', view.el);
        }
    });
});