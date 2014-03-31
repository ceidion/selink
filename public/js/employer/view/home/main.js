define([
    'text!employer/template/home/main.html',
    'common/collection/base',
    'common/Model/job',
    'common/view/post/item',
    'common/view/job/item'
], function(
    template,
    BaseCollection,
    JobModel,
    PostItemView,
    JobItemView
) {

    var JobsCollection = BaseCollection.extend({
        model: JobModel
    });

    return Backbone.Marionette.CompositeView.extend({

        // Template
        template: template,

        // Class name
        // className: "row",

        // item view container
        itemViewContainer: '.item-container',

        getItemView: function(item) {

            if (item.collection == this.postsCollection)
                return PostItemView;
            else if (item.collection == this.jobsCollection)
                return JobItemView;
        },

        // Events
        events: {

        },

        collectionEvents: {
            'sync': 'reIsotope'
        },

        // Initializer
        initialize: function() {

            this.collection = new BaseCollection(null, {
                comparator: function(item) {
                    // sort by createDate
                    var date = moment(item.get('createDate'));
                    return Number(date.valueOf());
                }
            });
            this.postsCollection = new BaseCollection(null, {document: this.model});
            this.jobsCollection = new JobsCollection(null, {document: this.model});

            var self = this;

            this.postsCollection.fetch({
                url: '/posts',
                success: function(collection, response, options) {
                    self.collection.add(self.postsCollection.models);
                    self.collection.sort();
                    self.reIsotope();
                }
            });

            this.jobsCollection.fetch({
                url: '/jobs',
                success: function(collection, response, options) {
                    self.collection.add(self.jobsCollection.models);
                    self.collection.sort();
                    self.reIsotope();
                }
            });
        },

        // After render
        onRender: function() {

        },

        // After show
        onShow: function() {

        },

        // re-isotope after collection get synced
        reIsotope: function() {

            var self = this;

            this.$el.find('.item-container').imagesLoaded(function() {
                self.$el.find('.item-container').isotope({
                    layoutMode: 'selinkMasonry',
                    itemSelector : '.post-item, .job-item',
                    resizable: false
                });
            });
        },

        shiftColumn: function(event, view) {
            this.$el.isotope('selinkShiftColumn', view.el);
        }
    });
});