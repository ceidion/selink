define([
    'text!common/template/friend/main.html',
    'common/view/friend/invited',
    'common/view/friend/friend',
    'common/view/post/item'
], function(
    pageTemplate,
    InvitedView,
    FriendsView,
    ItemView
) {

    var PostsCollection = Backbone.Collection.extend({

        idAttribute: "_id",

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url: function() {
            return this.document.url() + '/posts?category=friend';
        }
    });

    return Backbone.Marionette.CompositeView.extend({

        // Template
        template: pageTemplate,

        // item view container
        itemViewContainer: this.$el,

        // item view
        itemView: ItemView,

        events: {
            'click .btn-flip': 'flipcard'
        },

        collectionEvents: {
            'sync': 'reIsotope',
        },

        // Initializer
        initialize: function() {

            this.invitedView = new InvitedView({
                model: selink.userModel
            });

            this.friendsView = new FriendsView({
                model: selink.userModel
            });

            this.collection = new PostsCollection();
            this.collection.document = selink.userModel;

            this.collection.fetch({
                // after initialize the collection
                success: function() {
                    // change the behavior of add sub view
                    self.appendHtml = function(collectionView, itemView, index) {
                        // prepend new post and reIsotope
                        this.$el.find(this.itemViewContainer).prepend(itemView.$el).isotope('reloadItems');
                    };
                }
            });
        },

        // After render
        onRender: function() {

            this.rm = new Backbone.Marionette.RegionManager();
            this.regions = this.rm.addRegions({
                invitedRegion: '#invited',
                friendsRegion: '#friends'
            });
        },

        // After show
        onShow: function() {

            this.$el.addClass('animated fadeInRight');

            this.regions.invitedRegion.show(this.invitedView);
            this.regions.friendsRegion.show(this.friendsView);
        },

        onBeforeClose: function() {
            this.rm.close();
        },

        reIsotope: function() {

            var self = this;

            this.$el.imagesLoaded(function() {
                self.$el.isotope({
                    layoutMode: 'selinkMasonry',
                    itemSelector : '.post-item',
                    resizable: false,
                    selinkMasonry: {
                      cornerStampSelector: '.corner-stamp'
                    },
                });
            });

            $(window).smartresize(function(){
                self.$el.isotope({
                    layoutMode: 'selinkMasonry',
                    selinkMasonry: {
                      cornerStampSelector: '.corner-stamp'
                    },
                });
            });
        },

        flipcard: function() {
            var back = flippant.flip(this.$el.find('#friends'), this.$el.find('#invited'));
        }
    });

});