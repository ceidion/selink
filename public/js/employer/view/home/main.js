define([
    'text!employer/template/home/main.html',
    'common/collection/base',
    'common/Model/job',
    'common/Model/post',
    'common/view/post/item',
    'common/view/job/item'
], function(
    template,
    BaseCollection,
    JobModel,
    PostModel,
    PostItemView,
    JobItemView
) {

    var NewsFeedCollection = BaseCollection.extend({

        url: '/newsfeed',

        model: function(attrs, options) {

            if (_.has(attrs, 'expiredDate')) {
                return new JobModel(attrs, options);
            } else {
                return new PostModel(attrs, options);
            }
        },

        comparator: function(item) {
            // sort by createDate
            var date = moment(item.get('createDate'));
            return 0 - Number(date.valueOf());
        }
    });

    return Backbone.Marionette.CompositeView.extend({

        // Template
        template: template,

        // Class name
        // className: "row",

        // item view container
        itemViewContainer: '.item-container',

        getItemView: function(item) {

            if (item.has('expiredDate'))
                return JobItemView;
            else
                return PostItemView;
        },

        // Events
        events: {

        },

        collectionEvents: {
            // 'sync': 'reIsotope',
            'sort': 'reIsotope',
        },

        // Initializer
        initialize: function() {

            this.collection = new NewsFeedCollection();
            this.collection.fetch();

            // this.postsCollection = new PostsCollection();
            // this.jobsCollection = new JobsCollection();

            // var self = this;

            // this.postsCollection.fetch({
            //     url: '/posts/news',
            //     success: function(collection, response, options) {

            //         // self.collection.add(self.postsCollection.models);

            //         self.jobsCollection.fetch({
            //             url: '/jobs/news',
            //             success: function(collection, response, options) {
            //                 self.collection.add(_.union(self.jobsCollection.models, self.postsCollection.models));
            //             }
            //         });
            //     }
            // });

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

            this.render();

            this.$el.find('.item-container').imagesLoaded(function() {
                self.$el.find('.item-container').isotope({
                    layoutMode: 'selinkMasonry',
                    itemSelector : '.isotope-item',
                    resizable: false
                });
            });
        },

        shiftColumn: function(event, view) {
            this.$el.isotope('selinkShiftColumn', view.el);
        }
    });
});