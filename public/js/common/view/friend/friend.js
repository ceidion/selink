define([
    'text!common/template/friend/friend.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/view/friend/empty',
    'common/view/friend/item',
], function(
    template,
    BaseView,
    BaseCollection,
    EmptyView,
    ItemView) {

    return BaseView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '.ace-thumbnails',

        // item view
        itemView: ItemView,

        // empty view
        emptyView: EmptyView,

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
            this.$el.find('.widget-main').slimScroll({
                height: 300,
                railVisible:true
            });
        }

    });
});