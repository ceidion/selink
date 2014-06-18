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
        },

        // after show
        onShow: function() {
            // make container scrollable
            this.$el.find('.widget-main').niceScroll({
                horizrailenabled: false
            });
        }

    });
});