define([
    'text!common/template/friend/friend.html',
    'common/view/friend/empty',
    'common/view/friend/item',
], function(
    template,
    EmptyView,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // class name
        className: "widget-box widget-color-green",

        // template
        template: template,

        // item view container
        itemViewContainer: '.widget-main',

        // item view
        itemView: ItemView,

        // empty view
        emptyView: EmptyView,

        // after the view collection rendered
        onCompositeCollectionRendered: function() {

            var self = this;

            // use imageLoaded plugin
            this.$el.find('.widget-main').imagesLoaded(function() {
                // enable isotope
                self.$el.find('.widget-main').isotope({
                    itemSelector : '.photo-item',
                    masonry: {
                        columnWidth: '.photo-item'
                    }
                });
            });

            this.appendHtml = function(collectionView, itemView, index) {
                // ensure the image are loaded
                self.$el.find(self.itemViewContainer).imagesLoaded(function() {
                    // prepend new item and reIsotope
                    self.$el.find(self.itemViewContainer).append(itemView.$el).isotope('prepended', itemView.$el);
                });
            };
        },

        // after show
        onShow: function() {
            // make container scrollable
            this.$el.find('.widget-main').niceScroll({
                horizrailenabled: false
            });
        },

        // TODO: remove on friend-break
        onBeforeRemoveChild: function() {
            console.log(arguments);
        }

    });
});