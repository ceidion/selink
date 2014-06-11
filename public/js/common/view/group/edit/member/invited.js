define([
    'text!common/template/group/edit/member/invited.html',
    'common/view/composite-isotope',
    'common/view/group/edit/member/item'
], function(
    template,
    BaseView,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '.ace-thumbnails',

        // item view
        itemView: ItemView,

        collectionEvents: {
            'add': 'layout'
        },

        // initailizer
        initialize: function() {

            // all the selected friend will saved here
            this.selectFriends = [];
        },

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
            }, 300);
        },

        // after show
        onShow: function() {

            // make container scrollable
            this.$el.find('.widget-main').niceScroll({
                horizrailenabled: false
            });
        },

        layout: function() {
            console.log("add");
            console.log(arguments);
            // enable isotope
            // enable isotope
            this.$el.find(this.itemViewContainer).isotope({
                itemSelector : '.isotope-item'
            });
        }

    });
});