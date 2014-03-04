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

        collectionEvents: {
            'sync': 'reIsotope',
        },

        // Initializer
        initialize: function() {

            $.Isotope.prototype._masonryResizeChanged = function() {
              return true;
            };

            $.Isotope.prototype._masonryReset = function() {
              // layout-specific props
              this.masonry = {};
              this._getSegments();
              var i = this.masonry.cols;
              this.masonry.colYs = [];
              while (i--) {
                this.masonry.colYs.push( 0 );
              }

              if ( this.options.masonry && this.options.masonry.cornerStampSelector ) {
                var $cornerStamp = this.element.find( this.options.masonry.cornerStampSelector ),
                    stampWidth = $cornerStamp.outerWidth(true) - ( this.element.width() % this.masonry.columnWidth ),
                    cornerCols = Math.ceil( stampWidth / this.masonry.columnWidth ),
                    cornerStampHeight = $cornerStamp.outerHeight(true);
                for ( i = Math.max( this.masonry.cols - cornerCols, cornerCols ); i < this.masonry.cols; i++ ) {
                  this.masonry.colYs[i] = cornerStampHeight;
                }
              }
            };

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
                    // options
                    itemSelector : '.post-item',
                    masonry: {
                      columnWidth: 410,
                      cornerStampSelector: '.corner-stamp'
                    },
                });
            });
        }
    });

});