define([
    'text!common/template/group/detail/member/invited.html',
    'common/view/group/detail/member/item-ro'
], function(
    template,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // class name
        className: "widget-box transparent",

        // template
        template: template,

        // item view container
        itemViewContainer: '.ace-thumbnails',

        // item view
        itemView: ItemView,

        // after the view collection rendered
        onCompositeCollectionRendered: function() {

            var self = this;

            // here we need a time-out call, cause this view is in a modal
            // and the modal will take a piece of time to be visible.
            // isotope only process the visible elements, if we isotope on it immediatly
            // isotope will not work. so I wait 0.3s here
            setTimeout(function() {
                // enable isotope
                self.$el.find(self.itemViewContainer).isotope({
                    itemSelector : '.isotope-item'
                });

                self.appendHtml = function(collectionView, itemView, index) {
                    // ensure the image are loaded
                    self.$el.find(self.itemViewContainer).imagesLoaded(function() {
                        // prepend new item and reIsotope
                        self.$el.find(self.itemViewContainer).append(itemView.$el).isotope('prepended', itemView.$el);
                    });
                };

            }, 300);
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