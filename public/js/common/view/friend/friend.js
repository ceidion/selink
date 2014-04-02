define([
    'text!common/template/friend/friend.html',
    'common/collection/base',
    'common/view/friend/empty',
    'common/view/friend/item',
], function(
    template,
    BaseCollection,
    EmptyView,
    ItemView) {

    var Friends = BaseCollection.extend({

        url: '/friends'
    });

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '.ace-thumbnails',

        // item view
        itemView: ItemView,

        // empty view
        emptyView: EmptyView,

        // ui
        ui: {
            container: '.ace-thumbnails'
        },

        // // isotope after collection populated
        // collectionEvents: {
        //     'sync': 'reIsotope',
        // },

        // initializer
        initialize: function() {

            // create collection
            this.collection = new Friends();
            this.collection.fetch();
        },

        // after show
        onShow: function() {
            // make container scrollable
            this.$el.find('.widget-main').slimScroll({
                height: 300,
                railVisible:true
            });
        },

        reIsotope: function() {

            if (this.collection.length === 0)
                return;

            var self = this;

            this.ui.container.imagesLoaded(function() {
                self.ui.container.isotope({
                  // options
                  itemSelector : 'li',
                });
            });
        },
    });

});