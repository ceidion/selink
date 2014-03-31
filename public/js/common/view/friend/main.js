define([
    'text!common/template/friend/main.html',
    'common/collection/base',
    'common/view/friend/invited',
    'common/view/friend/friend',
    'common/view/post/item'
], function(
    pageTemplate,
    BaseCollection,
    InvitedView,
    FriendsView,
    ItemView
) {

    var PostsCollection = BaseCollection.extend({

        url: '/posts?category=friend'
    });

    return Backbone.Marionette.CompositeView.extend({

        // Template
        template: pageTemplate,

        // item view container
        itemViewContainer: this.$el,

        // item view
        itemView: ItemView,

        // collection events
        collectionEvents: {
            'sync': 'onSync',
        },

        // item view events
        itemEvents: {
            'shiftColumn': 'shiftColumn'
        },

        // Initializer
        initialize: function() {

            // create invited friends view
            this.invitedView = new InvitedView();

            // create firends view
            this.friendsView = new FriendsView();

            // create posts collection
            this.collection = new PostsCollection();

            // fetch the posts
            this.collection.fetch({
                // after initialize the collection
                success: function() {
                    // change the behavior of add sub view
                    self.appendHtml = function(collectionView, itemView, index) {
                        // prepend new post and reIsotope
                        this.$el.prepend(itemView.$el).isotope('reloadItems');
                    };
                }
            });
        },

        // After render
        onRender: function() {

            // create region manager (this composite view will have layout ability)
            this.rm = new Backbone.Marionette.RegionManager();
            // create regions
            this.regions = this.rm.addRegions({
                invitedRegion: '#invited',
                friendsRegion: '#friends'
            });
        },

        // After show
        onShow: function() {
            // show invited friends view
            this.regions.invitedRegion.show(this.invitedView);
            // show friends view
            this.regions.friendsRegion.show(this.friendsView);
        },

        // before close
        onBeforeClose: function() {
            // close region manager
            this.rm.close();
        },

        // re-isotope after collection get synced
        onSync: function(model_or_collection, resp, options) {

            // reIsotope is a custom option, used here for stop isotope running when single item object get synced
            // (itme object's sync event will proxy through to collection by backbone)
            if (_.has(options, 'reIsotope') && !options.reIsotope) return;

            var self = this;

            // use imageLoaded plugin
            this.$el.imagesLoaded(function() {
                // re-isotope
                self.$el.isotope({
                    layoutMode: 'selinkMasonry',
                    itemSelector : '.post-item',
                    resizable: false,
                    selinkMasonry: {
                      cornerStampSelector: '.corner-stamp'
                    },
                });
            });
        },

        shiftColumn: function(event, view) {
            this.$el.isotope('selinkShiftColumn', view.el);
        }

    });
});