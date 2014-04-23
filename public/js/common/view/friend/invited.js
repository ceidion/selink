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
        itemViewContainer: '.ace-thumbnails',

        // item view
        itemView: ItemView,

        // initializer
        initialize: function() {

            var self = this;

            // use imageLoaded plugin
            this.$el.find('.ace-thumbnails').imagesLoaded(function() {
                // enable isotope
                self.$el.find('.ace-thumbnails').isotope({
                    itemSelector : '.thumbnail',
                    masonry: {
                        columnWidth: '.thumbnail'
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