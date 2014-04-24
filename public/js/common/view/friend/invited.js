define([
    'text!common/template/friend/invited.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/view/friend/item',
], function(
    template,
    BaseView,
    BaseCollection,
    ItemView
) {

    return BaseView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '.widget-main',

        // item view
        itemView: ItemView,

        // initializer
        initialize: function() {

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