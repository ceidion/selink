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

        // child view container
        childViewContainer: '.widget-main',

        // child view
        childView: ItemView,

        // empty view
        emptyView: EmptyView,

        attachHtml: function(collectionView, itemView, index) {

            var self = this;

            // ensure the image are loaded
            self.$el.find(self.childViewContainer).imagesLoaded(function() {
                // prepend new item and reIsotope
                self.$el.find(self.childViewContainer).append(itemView.$el).isotope('prepended', itemView.$el);
            });
        },

        // after show
        onShow: function() {

            var self = this;

            // enable isotope
            this.$el.find(this.childViewContainer).isotope({
                itemSelector : '.photo-item'
            });

            // make container scrollable
            this.$el.find('.widget-main').niceScroll({
                horizrailenabled: false
            });
        },

        // TODO: remove on friend-break
        onBeforeRemoveChild: function() {
            // console.log(arguments);
        },

        onAddChild: function() {
            // console.log(arguments);
        }

    });
});